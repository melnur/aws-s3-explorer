import { watch, computed } from 'vue';
import { DateTime } from 'luxon';
import DEBUG from './logger';
import store from './store';
import jwtManager from './jwtManager';

export function correctClockSkew(Bucket) {
  DEBUG.log('Invoke headBucket:', Bucket);

  // Head the bucket to get a Date response. The 'date' header will need
  // to be exposed in S3 CORS configuratio
  const s3client = new AWS.S3({ region: store.region });
  s3client.headBucket({ Bucket }, (err, data) => {
    if (err) {
      DEBUG.log('headBucket error:', err);
    } else {
      DEBUG.log('headBucket data:', JSON.stringify(data));
      DEBUG.log('headBucket headers:', JSON.stringify(this.httpResponse.headers));

      if (this.httpResponse.headers.date) {
        const date = Date.parse(this.httpResponse.headers.date);
        DEBUG.log('headers date:', date);
        AWS.config.systemClockOffset = new Date() - date;
        DEBUG.log('clock offset:', AWS.config.systemClockOffset);
        // Can now safely generate presigned urls
      }
    }
  });
}

const sha256 = str => crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));

const generateNonce = async () => {
  const hash = await sha256(crypto.getRandomValues(new Uint32Array(4)).toString());
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
  const hashArray = Array.from(new Uint8Array(hash));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const base64URLEncode = string => btoa(String.fromCharCode.apply(null, new Uint8Array(string))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export async function login(forceLogin) {
  const searchParams = new URL(window.location).searchParams;
  store.initialized = true;
  if (store.tokens && DateTime.fromSeconds(jwtManager.decode(store.tokens.access_token).exp) > DateTime.utc()) {
    store.autoLoginIn = true;
    DEBUG.log('Found login token skipping login');
    await convertCredentialsToAWSCredentials();
    store.showSettings = false;
    return;
  }

  const code = searchParams.get('code');
  if (code !== null) {
    const newUrl = new URL(window.location);
    newUrl.searchParams.delete('nonce');
    newUrl.searchParams.delete('expires_in');
    newUrl.searchParams.delete('access_token');
    newUrl.searchParams.delete('id_token');
    newUrl.searchParams.delete('state');
    newUrl.searchParams.delete('code');
    newUrl.searchParams.delete('iss');
    window.history.replaceState({}, undefined, newUrl.toString());

    const codeVerifier = localStorage.getItem('codeVerifier');
    if (codeVerifier === null) {
      throw new Error('Unexpected code');
    }

    const codeExchangeBody = Object.entries({
      grant_type: 'authorization_code',
      client_id: store.applicationClientId,
      code,
      code_verifier: codeVerifier,
      redirect_uri: `${window.location.origin}${window.location.pathname}`
    }).map(([k, v]) => `${k}=${v}`).join('&');

    const res = await fetch(`${store.applicationLoginUrl}/oauth2/token`, {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/x-www-form-urlencoded' }),
      body: codeExchangeBody
    });
    if (!res.ok) {
      throw new Error(await res.json());
    }
    const tokens = await res.json();
    store.tokens = tokens;
    await convertCredentialsToAWSCredentials();
    store.showSettings = false;
    store.autoLoginIn = true;
    return;
  }

  DEBUG.log('Validating login parameters');
  if (!store.awsAccountId || !store.applicationLoginUrl || !store.applicationClientId || !store.identityPoolId) {
    DEBUG.log('Missing required parameter for login', store.awsAccountId, store.applicationLoginUrl, store.applicationClientId, store.identityPoolId);
    store.showSettings = true;
    return;
  }

  try {
    // eslint-disable-next-line no-new
    new URL(store.applicationLoginUrl);
  } catch (error) {
    DEBUG.log('Invalid application login url:', store.applicationLoginUrl);
    return;
  }

  if (!forceLogin && !store.autoLoginIn) {
    return;
  }
  // otherwise redirect login
  store.autoLoginIn = false;
  const nonce = await generateNonce();
  const codeVerifier = await generateNonce();
  localStorage.setItem('codeVerifier', codeVerifier);
  const codeChallenge = base64URLEncode(await sha256(codeVerifier));
  // redirect to login
  const redirectUri = `${window.location.origin}${window.location.pathname}`;
  store.loggedOut = false;
  window.location = `${store.applicationLoginUrl}/oauth2/authorize?response_type=code&client_id=${store.applicationClientId}&state=${nonce}&code_challenge_method=S256&code_challenge=${codeChallenge}&redirect_uri=${redirectUri}`;
  await convertCredentialsToAWSCredentials();
}

const awsAccountId = computed(() => store.awsAccountId);
watch(awsAccountId, newAwsAccountId => {
  setConfiguration(newAwsAccountId);
});

const suggestedRegion = 'eu-west-1';

export async function setConfiguration(newAwsAccountId) {
  DEBUG.log(`AccountID changed, updating configuration: ${newAwsAccountId}`);
  if (!newAwsAccountId) {
    store.applicationClientId = null;
    store.applicationLoginUrl = null;
    store.userRoleId = null;
    return;
  }

  if (store.awsAccountId) {
    let configuration;
    try {
      const data = await fetch(`https://s3.${suggestedRegion}.amazonaws.com/s3-explorer.${store.awsAccountId}.${suggestedRegion}/configuration.json`);
      configuration = await data.json();
    } catch (error) {
      try {
        const data = await fetch(`https://s3.${suggestedRegion}.amazonaws.com/s3-explorer.${store.awsAccountId}/configuration.json`);
        configuration = await data.json();
      } catch (retryError) {
        DEBUG.log('Failed to load configuration', error);
        bootbox.alert(`Error looking up account configuration: ${error.message}`);
        return;
      }
    }

    DEBUG.log('Configuration for account fetched:', configuration);
    store.applicationClientId = configuration.applicationClientId;
    store.identityPoolId = configuration.identityPoolId;
    store.cognitoPoolId = configuration.cognitoPoolId;
    store.region = store.identityPoolId.split(':')[0];
    store.applicationLoginUrl = `https://${configuration.applicationLoginUrl}.auth.${store.region}.amazoncognito.com`;
  }
}

function convertCredentialsToAWSCredentials() {
  if (!store.identityPoolId) {
    return;
  }

  if (!store.tokens) {
    return;
  }

  try {
    const cognitoUserPoolId = jwtManager.decode(store.tokens.id_token).iss.split('/').slice(-1)[0];
    AWS.config.region = store.region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: store.identityPoolId,
      Logins: { [`cognito-idp.${AWS.config.region}.amazonaws.com/${cognitoUserPoolId}`]: store.tokens.id_token }
    });

    DEBUG.log('Checking credentials');
    AWS.config.credentials.get(async () => {
      try {
        const stsResult = await new AWS.STS({ region: store.region }).getCallerIdentity().promise();
        DEBUG.log('AWS Credentials Set', stsResult);
        store.userRoleId = stsResult.Arn.split('/')[1];
        store.autoLoginIn = true;
      } catch (error) {
        DEBUG.log('Failed to get credentials, following requests will not work due to the error:', error);
        store.awsAccountId = null;
        store.applicationClientId = null;
      }
    });
  } catch (error) {
    DEBUG.log('Failed to set credentials, following requests will not work due to the error:', error);
  }
}

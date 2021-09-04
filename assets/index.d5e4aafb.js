import{r as e,w as t,c as o,D as l,o as n,a,b as s,d as r,e as i,v as c,u as d,f as u,g as p,h as g,F as y,i as f,t as h,j as m,k as b,M as w,l as v,m as k,p as S,n as C,q as x,s as A,x as E,y as I,z as D,A as j,B as P,C as O,E as T,G as B,H as $}from"./vendor.aeb1db38.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();const R=()=>{};R.toString=()=>`[DEBUG ${(new Date).toString()}]`;var U={log:console.log.bind(console,"%s",R)};const L=JSON.parse(localStorage.getItem("s3console")||"{}"),_=e(Object.assign({region:null,delimiter:"/",currentBucket:null,rememberedBuckets:[],currentDirectory:null,awsAccountId:null,cognitoPoolId:null,applicationClientId:null,applicationLoginUrl:null,identityPoolId:null,userRoleId:null,objects:[],loggedOut:!1},L,{initialized:!1,showBucketSelector:!1,showSettings:!1,showAddFolder:!1,showTrash:!1,showUploads:!1,deletedObjects:{}}));t(_,(()=>{localStorage.setItem("s3console",JSON.stringify(_)),AWS.config.update({region:_.region})}));const F=o((()=>_.currentBucket));t(F,(()=>{_.deletedObjects={}}));var N=new class{decode(e){try{return e&&JSON.parse(function(e){let t=e.replace(/-/g,"+").replace(/_/g,"/");const o=t.length%4;if(o){if(1===o)throw new Error("InvalidLengthError: Input base64url string is the wrong length to determine padding");t+=new Array(5-o).join("=")}return atob(t)}(e.split(".")[1]))}catch(t){return null}}};const M=e=>crypto.subtle.digest("SHA-256",(new TextEncoder).encode(e)),z=async()=>{const e=await M(crypto.getRandomValues(new Uint32Array(4)).toString());return Array.from(new Uint8Array(e)).map((e=>e.toString(16).padStart(2,"0"))).join("")};async function K(){const e=new URL(window.location).searchParams;if(_.initialized=!0,_.tokens&&l.fromSeconds(N.decode(_.tokens.access_token).exp)>l.utc())return await W(),void(_.showSettings=!1);const t=e.get("code");if(null!==t){const e=new URL(window.location);e.searchParams.delete("nonce"),e.searchParams.delete("expires_in"),e.searchParams.delete("access_token"),e.searchParams.delete("id_token"),e.searchParams.delete("state"),e.searchParams.delete("code"),e.searchParams.delete("iss"),window.history.replaceState({},void 0,e.toString());const o=localStorage.getItem("codeVerifier");if(null===o)throw new Error("Unexpected code");const l=Object.entries({grant_type:"authorization_code",client_id:_.applicationClientId,code:t,code_verifier:o,redirect_uri:`${window.location.origin}${window.location.pathname}`}).map((([e,t])=>`${e}=${t}`)).join("&"),n=await fetch(`${_.applicationLoginUrl}/oauth2/token`,{method:"POST",headers:new Headers({"content-type":"application/x-www-form-urlencoded"}),body:l});if(!n.ok)throw new Error(await n.json());const a=await n.json();return _.tokens=a,await W(),void(_.showSettings=!1)}if(U.log("Validating login parameters"),!_.applicationLoginUrl||!_.applicationClientId||!_.identityPoolId)return U.log("Missing required parameter for login",_.applicationClientId,_.applicationClientId,_.identityPoolId),void(_.showSettings=!0);try{new URL(_.applicationLoginUrl)}catch(i){return void U.log("Invalid application login url:",_.applicationLoginUrl)}const o=await z(),n=await z();localStorage.setItem("codeVerifier",n);const a=(s=await M(n),btoa(String.fromCharCode.apply(null,new Uint8Array(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""));var s;const r=`${window.location.origin}${window.location.pathname}`;_.loggedOut=!1,window.location=`${_.applicationLoginUrl}/oauth2/authorize?response_type=code&client_id=${_.applicationClientId}&state=${o}&code_challenge_method=S256&code_challenge=${a}&redirect_uri=${r}`,await W()}function W(){if(_.identityPoolId&&_.tokens)try{const e=N.decode(_.tokens.id_token).iss.split("/").slice(-1)[0];AWS.config.region=_.region,AWS.config.credentials=new AWS.CognitoIdentityCredentials({IdentityPoolId:_.identityPoolId,Logins:{[`cognito-idp.${AWS.config.region}.amazonaws.com/${e}`]:_.tokens.id_token}}),U.log("Checking credentials"),AWS.config.credentials.get((async()=>{const e=await new AWS.STS({region:_.region}).getCallerIdentity().promise();U.log("AWS Credentials Set",e),_.userRoleId=e.Arn.split("/")[1]}))}catch(e){U.log("Failed to set credentials, following requests will not work due to the error:",e)}}const V={class:"modal-dialog"},q={class:"modal-content"},H=s("div",{class:"modal-header"},[s("h4",{class:"modal-title"},"S3 Explorer: Settings")],-1),G={class:"modal-body"},Y={class:"col-md-18"},J=s("h2",null,"Welcome to the AWS S3 Explorer",-1),Q={class:"",style:{width:"100%"}},Z=s("div",null," To log in specify the following configuration: ",-1),X=s("br",null,null,-1),ee={style:{display:"flex","align-items":"center"}},te=s("span",{style:{"flex-grow":"1","flex-shrink":"0","margin-right":"0.5rem"}},"AWS AccountId: ",-1),oe=s("br",null,null,-1),le=["disabled"],ne=[s("i",{class:"fas fa-sign-in-alt"},null,-1),p(" Login")],ae=s("hr",null,null,-1),se=s("h4",null,"One time AWS Cloud Formation setup",-1),re=p(" The S3 Explorer provides a quick setup step using a CFN template. Follow the steps to configure your account, and only need to be run once per AWS account. "),ie=p(" Enter your AWS Account ID and launch the CFN template"),ce=s("br",null,null,-1),de=p("(you'll be able to review on the next screen):"),ue=s("br",null,null,-1),pe={style:{display:"flex","align-items":"center"}},ge=s("a",{href:"https://console.aws.amazon.com/cloudformation/home?region=eu-west-1#/stacks/new?stackName=S3-Explorer&templateURL=https://s3-explorer-public-data.s3.eu-west-1.amazonaws.com/cloudformationTemplate.json",target:"_blank"},[s("img",{src:"https://s3.amazonaws.com/cloudformation-examples/cloudformation-launch-stack.png"})],-1),ye=p(" Next you'll connect your SSO Provider to Cognito, follow your provider's guide to create a new client. Set the "),fe=s("strong",null,"Redirect URI",-1),he=p(" property set it to be:"),me=s("br",null,null,-1),be={class:"input-group"},we=["value"],ve={class:"input-group-btn"},ke={key:0},Se=[s("i",{class:"fas fa-copy"},null,-1),p(" Copy")],Ce={key:1},xe=[s("i",{class:"fas fa-check"},null,-1),p(" Copy")],Ae=p(" Navigate to the newly created "),Ee=["href"],Ie=["href"],De=s("br",null,null,-1),je=p("Select an identity provider and fill in the credentials. "),Pe=["href"],Oe=s("br",null,null,-1),Te=p("Enable the new identity provider, that you just linked (then click "),Be=s("strong",null,"Save",-1),$e=p(") "),Re={setup(t){const l=e({region:null,copyButtonSuccess:!1}),p=o((()=>`https://eu-west-1.console.aws.amazon.com/cognito/users?region=eu-west-1#/pool/${_.cognitoPoolId}`)),y=()=>{g(`https://${_.awsAccountId}-s3explorer.auth.eu-west-1.amazoncognito.com/oauth2/idpresponse`,void 0,(()=>{l.copyButtonSuccess=!0}))};return(e,t)=>(n(),a("div",null,[s("div",V,[s("div",q,[s("form",{onSubmit:t[2]||(t[2]=r((e=>(async()=>{if(_.awsAccountId&&!_.applicationClientId)try{const e=await fetch(`https://s3.eu-west-1.amazonaws.com/s3-explorer.${_.awsAccountId}/configuration.json`),t=await e.json();U.log("Configuration for account fetched:",t),_.applicationClientId=t.applicationClientId,_.identityPoolId=t.identityPoolId,_.cognitoPoolId=t.cognitoPoolId,_.region=_.identityPoolId.split(":")[0],_.applicationLoginUrl=`https://${t.applicationLoginUrl}.auth.${_.region}.amazoncognito.com`}catch(e){return void bootbox.alert(`Error looking up account configuration: ${e}`)}await K()})()),["prevent"]))},[s("div",null,[H,s("div",G,[s("div",Y,[J,s("div",Q,[Z,X,s("div",ee,[te,oe,i(s("input",{name:"AWS AccountId","onUpdate:modelValue":t[0]||(t[0]=e=>d(_).awsAccountId=e),type:"text",class:"form-control",placeholder:"742482629247",required:"true",style:{"flex-grow":"1","margin-right":"0.5rem"}},null,512),[[c,d(_).awsAccountId]]),s("button",{style:{"flex-grow":"1","margin-right":"0.5rem"},type:"submit",class:"btn btn-primary",disabled:!d(_).awsAccountId},ne,8,le)]),ae,s("div",null,[se,re,s("ol",null,[s("li",null,[ie,ce,de,ue,s("div",pe,[i(s("input",{name:"AWS AccountId","onUpdate:modelValue":t[1]||(t[1]=e=>d(_).awsAccountId=e),type:"text",class:"form-control",placeholder:"742482629247",required:"true",style:{"flex-grow":"1","margin-right":"0.5rem"}},null,512),[[c,d(_).awsAccountId]]),ge])]),s("li",null,[ye,fe,he,me,s("div",be,[s("input",{name:"AWS AccountId",value:`https://${d(_).awsAccountId||""}-s3explorer.auth.eu-west-1.amazoncognito.com/oauth2/idpresponse`,type:"text",class:"form-control",placeholder:"742482629247",required:"true",style:{"flex-grow":"1"},disabled:!0},null,8,we),s("span",ve,[s("button",{style:{"flex-grow":"1"},class:"btn btn-primary",type:"button",onClick:y},[d(l).copyButtonSuccess?(n(),a("span",Ce,xe)):(n(),a("span",ke,Se))])])])]),s("li",null,[Ae,s("a",{href:`${d(p)}/federation-identity-providers`,target:"_blank"},"Cognito Pool:",8,Ee),s("ul",null,[s("li",null,[s("a",{href:`${d(p)}/federation-identity-providers`,target:"_blank"}," Federation > Identity providers",8,Ie),De,je]),s("li",null,[s("a",{href:`${d(p)}//app-integration-app-settings`,target:"_blank"}," App integration > App client settings > Enabled Identity Providers",8,Pe),Oe,Te,Be,$e])])])])]),u("",!0)])])])])],32)])])]))}},Ue=o({get:()=>_.currentBucket});async function Le(){_.objects=await _e(_.currentDirectory)}async function _e(e,t=!1){if(!_.currentBucket)return[];const o=new AWS.S3({maxRetries:0,region:_.region}),n={Bucket:_.currentBucket,Delimiter:t?void 0:_.delimiter,Prefix:e?e!==_.delimiter?`${e}/`:e:void 0,RequestPayer:"requester"};let a;for(;n.ContinuationToken||!a;){const e=await o.listObjectsV2(n).promise();a=(a||[]).concat(e.CommonPrefixes.map((e=>({key:e.Prefix.slice(0,-1)||_.delimiter,type:"DIRECTORY"})))).concat(e.Contents.map((e=>({key:e.Key,lastModified:l.fromJSDate(new Date(e.LastModified)).toFormat("DD TTT"),size:e.Size,storageClass:e.StorageClass,type:"PATH"})))),n.ContinuationToken=e.NextContinuationToken}return a}t(Ue,(()=>{Le()}));const Fe={class:"modal-dialog"},Ne={class:"modal-content"},Me={name:"settings_form"},ze=s("div",{class:"modal-header"},[s("h4",{class:"modal-title"},"Select an S3 Bucket")],-1),Ke={class:"modal-body"},We={class:"col-md-18"},Ve=p("Current Bucket: "),qe=s("br",null,null,-1),He=s("h4",null,"Select a bucket or specify a new one:",-1),Ge=s("small",null,"Enter a bucket",-1),Ye=p("Search for bucket"),Je=s("br",null,null,-1),Qe={key:0},Ze=[s("ul",{class:"nav nav-tabs","data-tabs":"tabs"},[s("li",{role:"presentation",class:"active"},[s("a",{href:"#cors","data-toggle":"tab"},"Listing Bucket Information")])],-1),s("div",{id:"my-tab-content",class:"tab-content"},[s("div",{class:"tab-pane active",id:"cors"},[s("p",null,"AWS S3 Service prevents the direct look up of buckets that a user or role has access to through the browser. Therefore they must be entered here. If the list of available buckets frequently changes and needs to be dynamically rendered it can be loaded at runtime using a configurable bucket list."),s("p",null,[p("THis functionality is currently under development, for additional information please create a "),s("a",{href:"https://github.com/Rhosys/aws-s3-explorer/issues",target:"_blank"},"GitHub Issue"),p(".")])])],-1)],Xe={key:1},et=s("ul",{class:"nav nav-tabs","data-tabs":"tabs"},[s("li",{role:"presentation",class:"active"},[s("a",{href:"#cors","data-toggle":"tab"},"CORS")])],-1),tt={id:"my-tab-content",class:"tab-content"},ot={class:"tab-pane active",id:"cors"},lt=s("p",null,"The browser cannot display the contents of this Amazon S3 bucket because it is missing proper cross-origin resource sharing (CORS) configuration.",-1),nt=s("p",null,"To configure CORS, you create a CORS configuration that identifies the origins allowed to access your bucket and the operations (HTTP methods) supported.",-1),at=s("p",null,"To do this, go to the Amazon S3 Console, select your bucket in the buckets panel, and click to reveal Permissions in the Properties pane. Click Edit CORS Configuration. The CORS Configuration Editor panel will open up with a field where you can enter a CORS Configuration. Enter a configuration similar to the following:",-1),st={key:2},rt=s("ul",{class:"nav nav-tabs","data-tabs":"tabs"},[s("li",{role:"presentation",class:"active"},[s("a",{href:"#cors","data-toggle":"tab"},"Access Denied")])],-1),it={id:"my-tab-content",class:"tab-content"},ct={class:"tab-pane active",id:"cors"},dt=s("p",null,"The role you are using is not configured to allow access to this bucket.",-1),ut=p("To configure permissions, update the IAM role ("),pt=p(") created as part of the S3 Explorer setup. The dedicated role should grant permissions similar the following:"),gt={class:"modal-footer"},yt={class:"form-group"},ft={class:"col-sm-offset-2 col-sm-10"},ht={setup(t){const o=e({showCorsError:null,suggestedCorsConfiguration:[{AllowedHeaders:["*"],AllowedMethods:["PUT","POST","DELETE","HEAD","GET"],AllowedOrigins:["https://rhosys.github.io","https://console.rhosys.ch"],ExposeHeaders:["x-amz-server-side-encryption","x-amz-request-id","x-amz-id-2"],MaxAgeSeconds:3e3}],suggestedBucketPolicy:{Version:"2012-10-17",Statement:[{Effect:"Allow",Action:["s3:*"],Resource:["*"]}]}}),l=async(e,t)=>{o.showError=null;try{await async function(e){const t=new AWS.S3({maxRetries:0,region:_.region});try{await t.getBucketCors({Bucket:e}).promise()}catch(o){if(o&&"NetworkingError"===o.code)throw Error("CORS");if(o&&"AccessDenied"===o.code)throw Error("PERMISSIONS");throw o}}(e)}catch(l){if("CORS"===l.message)return void(o.showError="CORS");if("PERMISSIONS"===l.message)return void(o.showError="PERMISSIONS");U.log("Failed to look up information about the bucket",l)}t||(_.showBucketSelector=!1)},r=e=>{_.rememberedBuckets.push({bucket:e}),_.currentBucket=e,l(e)};return f((async()=>{_.currentBucket&&await l(_.currentBucket,!0),_.rememberedBuckets.length||(o.showError="FETCH_ALL_BUCKETS")})),(e,t)=>(n(),a("div",null,[s("div",Fe,[s("div",Ne,[s("form",Me,[s("div",null,[ze,s("div",Ke,[s("div",We,[s("h4",null,[Ve,s("strong",null,h(d(_).currentBucket),1)]),qe,He,m(d(w),{modelValue:d(_).currentBucket,"onUpdate:modelValue":t[0]||(t[0]=e=>d(_).currentBucket=e),options:d(_).rememberedBuckets.map((e=>e.bucket)),placeholder:"Select a bucket or enter a new one",showLabels:!1,allowEmpty:!1,taggable:!0,"open-direction":"bottom",hideSelected:!0,closeOnSelect:!0,selectLabel:"(press enter to select)","tag-placeholder":"(press enter to select)",onTag:r,onSelect:l},{noOptions:b((()=>[Ge])),placeholder:b((()=>[Ye])),_:1},8,["modelValue","options"]),Je,"FETCH_ALL_BUCKETS"===d(o).showError?(n(),a("div",Qe,Ze)):u("",!0),"CORS"===d(o).showError?(n(),a("div",Xe,[et,s("div",tt,[s("div",ot,[lt,nt,at,s("p",null,[s("pre",null,h(JSON.stringify(d(o).suggestedCorsConfiguration,null,2)),1)])])])])):"PERMISSIONS"===d(o).showError?(n(),a("div",st,[rt,s("div",it,[s("div",ct,[dt,s("p",null,[ut,s("strong",null,h(d(_).userRoleId),1),pt]),s("p",null,[s("pre",null,h(JSON.stringify(d(o).suggestedBucketPolicy,null,2)),1)])])])])):u("",!0)])]),s("div",gt,[s("div",yt,[s("div",ft,[s("button",{type:"button",class:"btn btn-primary",onClick:t[1]||(t[1]=e=>d(_).showBucketSelector=!1)},"Close")])])])])])])])]))}};function mt(e){if(!e)return"";if(0===e)return"0 Bytes";const t=parseInt(Math.floor(Math.log(e)/Math.log(1024)),10);return`${Math.round(e/1024**t,2)} ${["Bytes","KB","MB","GB","TB"][t]}`}function bt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/\//g,"&#x2F;").replace(/`/g,"&#x60;").replace(/=/g,"&#x3D;")}function wt(e,t=!1){const o=e.replace(/^.*[\\/]/,"");return t?bt(o):o}const vt=String.fromCharCode(8230);function kt(e,t=!1){if(e.length<80)return t?bt(e):e;const o=`${function(e,t=!1){const o=e.split("/");o.splice(o.length-2,1);const l=o.join("/");return t?bt(l):l}(function(e,t=!1){const o=e.lastIndexOf("/"),l=-1===o?"/":e.substring(0,o+1);return t?bt(l):l}(e))+vt}/${wt(e)}`;if(o.length<80&&o.length>2)return t?bt(o):o;const l=`${e.substring(0,e.indexOf("/")+1)+vt}/${wt(e)}`,n=l.length<80?l:e.substring(0,80)+vt;return t?bt(n):n}function St(e){return e.replace(/^\/+/g,"").replace(/\/+$/g,"")}const Ct={id:"AddFolderModal",tabindex:"-1"},xt={class:"modal-dialog"},At={class:"modal-content"},Et={class:"modal-header"},It=s("h4",{class:"modal-title"},"S3 Explorer: Create New Folder",-1),Dt={class:"modal-body"},jt={class:"col-md-18"},Pt={class:"panel panel-default"},Ot={class:"panel-body"},Tt=s("p",null,"Please enter the relative path of the S3 folder to add to the current directory of the selected bucket, for example folder01 or Lorem/Ipsum/Bacon.",-1),Bt=p("Current Bucket: "),$t=s("br",null,null,-1),Rt=s("br",null,null,-1),Ut={class:"input-group bottom-marg-10"},Lt={class:"input-group-addon"},_t={class:"modal-footer"},Ft={class:"form-group"},Nt={class:"col-sm-offset-2 col-sm-10"},Mt=["disabled"],zt=[s("i",{class:"fa fa-folder-plus fa-lg"},null,-1),p(" Add Folder")],Kt={setup(t){const o=e({newFolderName:null});return(e,t)=>(n(),a("div",Ct,[s("div",xt,[s("div",At,[s("form",{onSubmit:t[3]||(t[3]=r((e=>{(async()=>{U.log("Adding new directory");const e=o.newFolderName.trim(),t=St(e),l=St(`${_.currentDirectory||""}${_.delimiter}${t}`);if(U.log("Calculated directory:",l),_.objects.find((e=>e.key===l&&"DIRECTORY"===e.type)))return void bootbox.alert(`Error: folder or object already exists at: ${l}`);const n=new AWS.S3(AWS.config),a={Bucket:_.currentBucket,Key:`${l}${_.delimiter}`};try{await n.headObject(a).promise(),U.log("Directory already exists, skipping creation")}catch(s){if(!s)return void bootbox.alert(`Error: directory or object already exists at: ${l}`);if(s&&"NotFound"!==s.code)return void bootbox.alert(`Error checking existence of folder: ${s}`);try{await n.putObject(a).promise()}catch(r){return U.log("putObject error:",r),void bootbox.alert(`Error creating folder: ${r}`)}}_.objects.push({key:`${_.currentDirectory}${_.delimiter}${e.split(_.delimiter)[0]}`,type:"DIRECTORY"}),_.showAddFolder=!1})()}),["prevent"]))},[s("div",null,[s("div",Et,[s("button",{type:"button",class:"close",onClick:t[0]||(t[0]=e=>d(_).showAddFolder=!1),"aria-hidden":"true"},"×"),It]),s("div",Dt,[s("div",jt,[s("div",Pt,[s("div",Ot,[Tt,s("span",null,[Bt,s("strong",null,h(d(_).currentBucket),1)]),$t,Rt,s("div",Ut,[s("span",Lt,h(d(_).currentDirectory||"(root)"),1),i(s("input",{name:"folder","onUpdate:modelValue":t[1]||(t[1]=e=>d(o).newFolderName=e),type:"text",class:"form-control",placeholder:"folder",required:"true"},null,512),[[c,d(o).newFolderName]])])])])])]),s("div",_t,[s("div",Ft,[s("div",Nt,[s("button",{type:"button",class:"btn btn-default",onClick:t[2]||(t[2]=e=>d(_).showAddFolder=!1)},"Cancel"),s("button",{type:"submit",disabled:!d(o).newFolderName,class:"btn btn-primary"},zt,8,Mt)])])])])],32)])])]))}},Wt={id:"TrashModal",tabindex:"-1"},Vt={class:"modal-dialog modal-xl"},qt={class:"modal-content"},Ht={class:"modal-header"},Gt={class:"modal-title"},Yt={class:"modal-body"},Jt={class:"col-md-18"},Qt={class:"panel-body"},Zt=p(" Please confirm that you want to delete the following objects from S3. "),Xt=s("br",null,null,-1),eo=p("Current Bucket: "),to=s("br",null,null,-1),oo=s("br",null,null,-1),lo={class:"table table-bordered table-hover table-striped",id:"trash-table"},no=s("thead",{id:"trash-thead"},[s("tr",null,[s("th"),s("th",null,"Object"),s("th",null,"Last Modified"),s("th",null,"Class"),s("th",null,"Size"),s("th",null,"Result")])],-1),ao={id:"trash-tbody"},so={key:0,class:"fas fa-folder",style:{"margin-right":"1rem"}},ro={key:0,class:"trasherror"},io={key:1,class:"trashdeleted"},co={key:2,class:"trasherror"},uo={key:3},po={class:"modal-footer"},go={class:"form-group"},yo={class:"col-sm-offset-2 col-sm-10"},fo=["disabled"],ho=s("i",{class:"fa fa-trash-alt fa-lg"},null,-1),mo={props:{selectedKeys:Array},emits:["trashCompleted"],setup(t,{emit:l}){const r=t,i=e({title:null,trashing:!1,objectStatus:{}});f((()=>{_.deletedObjects={}}));const c=o((()=>{var e;const t=null==(e=r.selectedKeys)?void 0:e.reduce(((e,t)=>(e[t]=!0,e)),{});return _.objects.filter((e=>t[e.key])).sort(((e,t)=>e.type===t.type?e.key.localeCompare(t.key):"DIRECTORY"===e.type?-1:1))})),g=o((()=>c.length?`Delete (${c.length})`:"Delete")),y=o((()=>!Object.keys(i.objectStatus).length||!!Object.values(i.objectStatus).find((e=>!e||"DELETED"!==e)))),m=()=>{_.objects=_.objects.filter((e=>!_.deletedObjects[e.key])),l("trashCompleted"),_.showTrash=!1},b=async(e,t,o)=>{U.log("Delete file count:",e.length),i.trashing=!0;const l=new AWS.S3({region:_.region}),n=t.reduce(((e,t)=>(e[t.key]=t,e)),{});await Promise.all(e.map((async e=>{if("DELETED"!==i.objectStatus[e]){U.log("Deleting key:",e);try{if("DIRECTORY"!==n[e].type)await l.deleteObject({Bucket:_.currentBucket,Key:e}).promise();else{const t=await _e(e);U.log("Queuing deletes for:",e,t),await b(t.map((e=>e.key)),t,!0)}U.log("DELETED:",e),o||(i.objectStatus[e]="DELETED",_.deletedObjects[e]=!0)}catch(t){if(U.log(`Failed to delete: ${e} - ${t}`),o)throw t;"AccessDenied"===t.code?i.objectStatus[e]="DENIED":i.objectStatus[e]=`Failed: ${t.code}`}}}))),i.trashing=!1};return(e,t)=>(n(),a("div",Wt,[s("div",Vt,[s("div",qt,[s("div",Ht,[s("button",{type:"button",class:"close",onClick:m},"×"),s("h4",Gt,"S3 Explorer: Delete "+h(d(i).count)+" objects",1)]),s("div",Yt,[s("div",Jt,[s("div",Qt,[s("p",null,[Zt,Xt,s("span",null,[eo,s("strong",null,h(d(_).currentBucket),1)]),to,oo]),s("table",lo,[no,s("tbody",ao,[(n(!0),a(v,null,k(d(c),((e,t)=>(n(),a("tr",{key:e.key},[s("td",null,h(t+1),1),s("td",null,["DIRECTORY"===e.type?(n(),a("i",so)):u("",!0),p(h(e.key),1)]),s("td",null,h(e.lastModified),1),s("td",null,h(e.storageClass),1),s("td",null,h(d(mt)(e.size)),1),s("td",null,["DENIED"===d(i).objectStatus[e.key]?(n(),a("span",ro,"Access Denied")):"DELETED"===d(i).objectStatus[e.key]?(n(),a("span",io,"Deleted")):d(i).objectStatus[e.key]?(n(),a("span",co,h(d(i).objectStatus[e.key]),1)):(n(),a("i",uo))])])))),128))])])])])]),s("div",po,[s("div",go,[s("div",yo,[s("button",{type:"button",class:"btn btn-default",onClick:m},h(d(y)?"Cancel":"Close"),1),d(i).trashing||d(y)?(n(),a("button",{key:0,type:"button",class:"btn btn-danger",onClick:t[0]||(t[0]=e=>b(r.selectedKeys,d(_).objects)),disabled:d(i).trashing},[ho,p(" "+h(d(g)),1)],8,fo)):u("",!0)])])])])])]))}};S("data-v-2f513a5a");const bo={id:"UploadModal",tabindex:"-1"},wo={class:"modal-dialog modal-xl"},vo={class:"modal-content"},ko={class:"modal-header"},So={class:"modal-title"},Co=p("Upload to: "),xo={class:"modal-body"},Ao={class:"col-md-18"},Eo={class:"panel-body"},Io=s("p",null," Please confirm that you want to upload the following files to S3: ",-1),Do={class:"table table-bordered table-hover table-striped",id:"upload-table"},jo=s("thead",{id:"upload-thead"},[s("tr",null,[s("th"),s("th",null,"Filename"),s("th",null,"Type"),s("th",null,"Size"),s("th",null,"Progress")])],-1),Po={id:"upload-tbody"},Oo={key:0},To={key:1,class:"progress"},Bo={key:2},$o=[s("span",{class:"progress-bar-danger"},"Access Denied",-1)],Ro={key:3},Uo=[s("span",{class:"progress-bar-danger"},null,-1)],Lo={key:4},_o={class:"uploadError"},Fo=p(" The selected files will be uploaded to:"),No=s("br",null,null,-1),Mo={key:0,class:"panel panel-success",style:{cursor:"pointer"}},zo=[A('<div class="panel-heading" style="display:flex;direction:row;align-items:center;justify-content:space-between;" data-v-2f513a5a><div style="display:flex;direction:row;align-items:center;" data-v-2f513a5a><div class="title " data-v-2f513a5a>Dropzone</div></div></div><div class="panel-body" style="overflow:auto;text-align:center;" data-v-2f513a5a> Drag and drop files and folders you want to upload here. <br data-v-2f513a5a><br data-v-2f513a5a><div class="text-muted" data-v-2f513a5a><strong data-v-2f513a5a>No files or folders</strong><br data-v-2f513a5a> You have not chosen any files or folders to upload. </div></div>',2)],Ko={class:"modal-footer"},Wo={class:"form-group"},Vo={class:"col-sm-offset-2 col-sm-10"},qo=["disabled"],Ho=s("i",{class:"fa fa-cloud-upload-alt fa-lg"},null,-1);C();const Go={props:{filesToUpload:Array},emits:["uploadsCompleted"],setup(t,{emit:l}){const r=t,i=e({uploadStarted:!1,completionPercentageMap:{}});let c={};const g=o((()=>i.uploadStarted&&Object.values(i.completionPercentageMap).every((e=>100===e)))),y=o((()=>i.uploadStarted?g?"FINISHED":"IN_PROGRESS":"WAITING_FOR_APPROVAL")),f=o((()=>{var e,t;return{WAITING_FOR_APPROVAL:1===(null==(e=r.filesToUpload)?void 0:e.length)?"Upload 1 file":`Upload ${null==(t=r.filesToUpload)?void 0:t.length} files`,IN_PROGRESS:"Cancel remaining uploads"}[y.value]})),m=()=>{if(!i.uploadStarted)return w();Object.keys(c).forEach((e=>{"number"==typeof i.completionPercentageMap[e]&&i.completionPercentageMap[e]<100&&c[e].abort()}))},b=()=>{l("uploadsCompleted"),_.showUploads=!1},w=()=>{c={},i.uploadStarted=!0,r.filesToUpload.forEach(((e,t)=>{U.log("Uploading file:",e);const o=new AWS.S3({region:_.region}),l={Bucket:_.currentBucket,Key:(_.currentDirectory&&`${_.currentDirectory}${_.delimiter}`||"")+(e.fullPath||e.name),ContentType:e.type,Body:e},n=o.upload(l);c[t]=n,i.completionPercentageMap[t]=0;n.on("httpUploadProgress",(o=>{U.log("File:",e,"Part:",o.part,o.loaded,"of",o.total),o.total&&(o.loaded,o.total),i.completionPercentageMap[t]=0})).send(((o,l)=>{o?"AccessDenied"===o.code?(U.log("Access Denied for upload:",e),i.completionPercentageMap[t]="DENIED"):"RequestAbortedError"===o.code?(U.log("Abort upload:",e),i.completionPercentageMap[t]="CANCELLED"):(U.log(JSON.stringify(o)),i.completionPercentageMap[t]=`FAILED: ${o.code}`):(U.log("Uploaded",e.name),i.completionPercentageMap[t]=100)}))}))};return(e,t)=>(n(),a("div",bo,[s("div",wo,[s("div",vo,[s("div",ko,[s("button",{type:"button",class:"close","aria-hidden":"true",onClick:b},"×"),s("h4",So,[Co,s("strong",null,h(d(_).currentDirectory),1)])]),s("div",xo,[s("div",Ao,[s("div",Eo,[Io,s("table",Do,[jo,s("tbody",Po,[(n(!0),a(v,null,k(r.filesToUpload,((e,t)=>(n(),a("tr",{key:d(kt)(e.fullPath||e.name)},[s("td",null,h(t+1),1),s("td",null,h(d(kt)(e.fullPath||e.name)),1),s("td",null,h(e.type),1),s("td",null,h(d(mt)(e.size)),1),s("td",null,[d(i).uploadStarted?"number"==typeof d(i).completionPercentageMap[t]?(n(),a("div",To,[s("span",{class:"progress-bar",style:x({width:`${d(i).completionPercentageMap[t]}%`})},h(d(i).completionPercentageMap[t])+"%",5)])):"DENIED"===d(i).completionPercentageMap[t]?(n(),a("div",Bo,$o)):"CANCELLED"===d(i).completionPercentageMap[t]?(n(),a("div",Ro,Uo)):d(i).completionPercentageMap[t]?(n(),a("div",Lo,[s("span",_o,h(d(i).completionPercentageMap[t]),1)])):u("",!0):(n(),a("div",Oo))])])))),128))])]),s("p",null,[Fo,No,s("strong",null,h(d(_).currentBucket)+" > "+h(d(_).currentDirectory||d(_).delimiter),1)])]),d(i).uploadStarted?u("",!0):(n(),a("div",Mo,zo))])]),s("div",Ko,[s("div",Wo,[s("div",Vo,[s("button",{disabled:"IN_PROGRESS"===d(i).status,type:"button",class:"btn btn-default",onClick:b},"Close",8,qo),d(f)?(n(),a("button",{key:0,type:"button",class:"btn btn-primary",onClick:m},[Ho,p(" "+h(d(f)),1)])):u("",!0)])])])])])]))},__scopeId:"data-v-2f513a5a"};S("data-v-5c7707a8");const Yo={class:"fixed-in-bottom-corner"},Jo=[s("div",{class:"badge d-flex align-items-center justify-content-center"},[s("div",{class:"d-flex align-items-center justify-content-center"},[s("span",{class:"mr-3 d-none d-sm-block"},[s("i",{class:"fas fa-bolt",style:{color:"gold"}}),p(" Powered By Authress")])])],-1)];C();const Qo={setup(e){const t=()=>{window.open("https://authress.io","_blank")};return(e,o)=>(n(),a("div",Yo,[s("div",{class:"contact-us pointer",onClick:t},Jo)]))},__scopeId:"data-v-5c7707a8"};S("data-v-60949c1c");const Zo={id:"dropzone",style:{"min-height":"100%"}},Xo=[s("div",{class:"dropzoneOverlayText"},[s("div",{class:"text"},[s("h2",{class:"title"},"Dropzone"),s("h3",null,"Drag and drop files and folders you want to upload here.")])],-1)],el=s("div",{id:"hiddenDropZoneList",style:{display:"none"}},null,-1);C();const tl={emits:["enter","leave","fileAdded"],setup(t,{emit:o}){const l=E(null),r=e({enterFunction:null,leaveFunction:null,dragster:null,overlayActive:!1});return f((()=>{r.dragster=new Dragster(l.value),r.enterFunction=e=>{r.overlayActive=!0,o("enter",e)},r.leaveFunction=e=>{r.overlayActive=!1,o("leave",e)},l.value.addEventListener("dragster:enter",r.enterFunction),l.value.addEventListener("dragster:leave",r.leaveFunction),I.autoDiscover=!1;new I("#dropzone",{autoQueue:!1,url:"IGNORED",previewsContainer:"#hiddenDropZoneList"}).on("addedfile",(e=>{console.log("File added",e.name,e.fullPath,e.size),o("fileAdded",e),r.overlayActive=!1,r.dragster.reset()}))})),D((()=>{})),(e,t)=>(n(),a("form",Zo,[s("div",{class:"dropzoneWrapper",ref:l},[s("div",{id:"overlay",class:j({displayOverlay:d(r).overlayActive})},Xo,2),P(e.$slots,"default",{},void 0,!0)],512),el]))},__scopeId:"data-v-60949c1c"};S("data-v-0e49523c");const ol={class:"col-12",style:{display:"flex","flex-direction":"column","flex-wrap":"nowrap"}},ll={class:"panel panel-primary",style:{"flex-grow":"1"}},nl={class:"panel-heading",style:{display:"flex",direction:"row","align-items":"center","justify-content":"space-between"}},al={style:{display:"flex",direction:"row","align-items":"center"}},sl=s("div",{class:"title d-flex",style:{"align-items":"center"}},[s("div",{style:{height:"30px",width:"30px",background:"white","border-radius":"5px","margin-right":"1rem"}},[s("img",{src:"./assets/bucket-logo-focused.74270df0.png",height:"30"})]),s("h4",null,"AWS S3 Explorer")],-1),rl={key:0,class:"",style:{"margin-right":"0.5rem"}},il={key:1},cl={key:2},dl={key:0,class:"btn-group"},ul={id:"badgecount",style:{cursor:"default"},class:"btn badge ",title:"Object count"},pl={key:1,class:"btn-group"},gl={id:"badgecount",style:{cursor:"default"},class:"btn badge ",title:"Selected object count"},yl={id:"navbuttons"},fl={class:"btn-group d-flex"},hl={key:0},ml=[s("img",{src:"./assets/github-logo.df940d40.svg",height:"28"},null,-1)],bl={class:"panel-body",style:{overflow:"auto"}},wl={key:0,style:{display:"flex","align-items":"center","justify-content":"space-between"}},vl=p(" /  "),kl=["href","onClick"],Sl=p(" /  "),Cl={style:{"flex-shrink":"0","flex-grow":"1",display:"flex","flex-direction":"row","flex-wrap":"no-wrap","justify-content":"flex-end"}},xl=["disabled"],Al=[s("i",{class:"fa fa-cloud-download-alt",style:{"margin-right":"0.5rem"}},null,-1),p("Download ")],El=[s("i",{class:"fa fa-folder-plus",style:{"margin-right":"0.5rem"}},null,-1),p("New Folder ")],Il=["disabled"],Dl=[s("i",{class:"fa fa-trash-alt",style:{"margin-right":"0.5rem"}},null,-1),p("Delete Objects ")],jl=s("br",null,null,-1),Pl={key:1,class:"table table-bordered table-hover table-striped",style:{width:"100%"},id:"s3objects-table"},Ol=s("th",null,"Object",-1),Tl=s("th",null,"Last Modified",-1),Bl=s("th",null,"Class",-1),$l=s("th",null,"Size",-1),Rl=["onClick"],Ul=["onUpdate:modelValue"],Ll=s("i",{class:"fas fa-folder",style:{"margin-right":"1rem"}},null,-1),_l=["href","onClick"],Fl=s("td",{style:{"text-align":"center"}},null,-1),Nl=s("td",{style:{"text-align":"center"}},null,-1),Ml=s("td",{style:{"text-align":"center"}},null,-1),zl=["onClick"],Kl=["onUpdate:modelValue"],Wl={style:{"text-align":"center"}},Vl={style:{"text-align":"center"}},ql={style:{"text-align":"center"}},Hl=[s("div",{class:"panel-heading",style:{display:"flex",direction:"row","align-items":"center","justify-content":"space-between"}},[s("div",{style:{display:"flex",direction:"row","align-items":"center"}},[s("div",{class:"title "},"Dropzone")])],-1),s("div",{class:"panel-body",style:{overflow:"auto","text-align":"center"}},[p(" Drag and drop files and folders you want to upload here. "),s("br"),s("br"),s("div",{class:"text-muted"},[s("strong",null,"No files or folders"),s("br"),p(" You have not chosen any files or folders to upload. ")])],-1)],Gl={class:"col-12"};C();const Yl={setup(l){const r=e({objectCount:0,selectedKeys:{},filesToUpload:[],globalSelect:!1}),c=()=>{_.showBucketSelector=!0};f((async()=>{if(_.loggedOut)_.showSettings=!0;else if(!_.initialized){await K();try{await Le()}catch(e){U.log("Fetching Bucket Objects Error: ",e),_.showBucketSelector=!0}}}));const p=e=>{r.filesToUpload.push(e),_.showUploads=!0},g=()=>{r.filesToUpload=[],r.selectedKeys={},Le()},w=async e=>{r.selectedKeys={},r.globalSelect=!1,_.currentDirectory=e,await Le()},S=async()=>{await async function(e,t){const o=new AWS.S3({maxRetries:0,region:_.rememberedBuckets.find((t=>t.bucket===e)).region||_.region}),l=async t=>{const l={Bucket:e,Key:t,RequestPayer:"requester"},n=await o.getObject(l).promise(),a=/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(n.ContentDisposition),s=a&&a[1].replace(/['"]/g,"")||t.split(_.delimiter).slice(-1)[0];y.exports.saveAs(new Blob([n.Body]),s)};await Promise.all(t.map((async e=>{"DIRECTORY"!==_.objects.find((t=>t.key===e)).type&&await l(e);const t=(await _e(e,!0)).map((e=>e.key));await Promise.all(t.map((e=>l(e))))})))}(_.currentBucket,Object.keys(r.selectedKeys))},C=o((()=>_.objects.sort(((e,t)=>e.key.localeCompare(t.key))))),A=o((()=>Object.keys(r.selectedKeys).filter((e=>!_.deletedObjects[e]&&r.selectedKeys[e])).length)),E=o((()=>_.currentDirectory===_.delimiter?[_.currentDirectory]:_.currentDirectory&&_.currentDirectory.split(_.delimiter)||[]));t(C,(async(e,t)=>{_.currentDirectory&&t.length&&!e.length&&await w(_.currentDirectory.split(_.delimiter).slice(0,-1).join(_.delimiter))}));const I=o((()=>r.globalSelect));return t(I,(e=>{C.value.forEach((t=>{r.selectedKeys[t.key]=e}))})),(e,t)=>(n(),O(tl,{onFileAdded:p},{default:b((()=>[s("div",ol,[s("div",ll,[s("div",nl,[s("div",al,[sl,d(_).tokens&&d(_).currentBucket?(n(),a("div",rl,[s("button",{type:"button",class:"btn btn-default",onClick:c},h(d(_).currentBucket),1)])):d(_).tokens?(n(),a("div",il,[s("button",{type:"button",class:"btn btn-default",onClick:c},"Select Bucket")])):u("",!0),d(_).tokens&&d(_).currentBucket?(n(),a("div",cl,[0===d(A)?(n(),a("div",dl,[s("span",ul,h(d(_).objects.length)+" "+h(d(_).objects.length>1?"objects":"object"),1)])):u("",!0),d(A)>0?(n(),a("div",pl,[s("span",gl,h(d(A))+" of "+h(d(_).objects.length)+" selected",1)])):u("",!0)])):u("",!0)]),s("div",yl,[s("div",fl,[d(_).currentBucket&&d(_).tokens?(n(),a("div",hl,[s("span",{style:{cursor:"pointer"},class:j(["btn fa fa-sync fa-2x",{"fa-spin":d(r).loading}]),onClick:t[0]||(t[0]=e=>(async()=>{const e=new Promise((e=>setTimeout(e,1e3)));try{r.loading=!0,await Le()}catch(t){_.showBucketSelector=!0}await e,r.loading=!1})()),title:"Reload the directory"},null,2)])):u("",!0),s("span",{style:{cursor:"pointer"},class:"btn fa fa-sign-out-alt fa-2x",onClick:t[1]||(t[1]=e=>(()=>{if(U.log("Logging out"),_.objects=[],_.loggedOut=!0,_.tokens){_.tokens=null;const e=`${window.location.origin}${window.location.pathname}`;window.location=`${_.applicationLoginUrl}/logout?client_id=${_.applicationClientId}&logout_uri=${e}`}else _.showSettings=!0})()),title:"Logout"}),s("span",{style:{cursor:"pointer"},class:"btn fa",onClick:t[2]||(t[2]=e=>{window.open("https://github.com/Rhosys/aws-s3-explorer#aws-s3-explorer","_blank")}),title:"Check out the source at Github.com"},ml)])])]),s("div",bl,[d(_).tokens&&d(_).currentBucket?(n(),a("div",wl,[s("div",null,[s("span",null,[s("a",{href:"#",onClick:t[3]||(t[3]=e=>w(null))},h(d(_).currentBucket),1)]),vl,(n(!0),a(v,null,k(d(E),((e,t)=>(n(),a("span",{key:e},[s("a",{style:x({"text-decoration":t+1===d(E).length?"none":void 0,color:t+1===d(E).length?"unset":void 0,cursor:t+1===d(E).length?"unset":"pointer"}),href:`#path=${d(E).slice(0,t+1).join(d(_).delimiter)}`,onClick:e=>w(d(E).slice(0,t+1).join(d(_).delimiter))},h(e.length>30?`${e.slice(0,30)}…`:e),13,kl),Sl])))),128))]),s("div",Cl,[s("button",{type:"button",style:{cursor:"pointer","margin-left":"0.5rem"},class:"text-primary btn btn-xs btn-warning",disabled:!d(A),onClick:S,title:"Download files"},Al,8,xl),s("button",{type:"button",style:{cursor:"pointer","margin-left":"0.5rem"},class:"text-primary btn btn-xs btn-primary",onClick:t[4]||(t[4]=e=>d(_).showAddFolder=!0),title:"New folder"},El),s("button",{type:"button",style:{cursor:"pointer","margin-left":"0.5rem"},class:"text-primary btn btn-xs btn-danger",disabled:!d(A),onClick:t[5]||(t[5]=e=>d(_).showTrash=!0),title:"Delete Objects"},Dl,8,Il)])])):u("",!0),jl,d(_).tokens?(n(),a("table",Pl,[s("thead",null,[s("tr",null,[s("th",{class:"text-center",style:{"text-align":"center",cursor:"pointer"},onClick:t[7]||(t[7]=e=>d(r).globalSelect=!d(r).globalSelect)},[i(s("input",{type:"checkbox","onUpdate:modelValue":t[6]||(t[6]=e=>d(r).globalSelect=e)},null,512),[[T,d(r).globalSelect]])]),Ol,Tl,Bl,$l])]),s("tbody",null,[(n(!0),a(v,null,k(d(C).filter((e=>"DIRECTORY"===e.type)),(e=>(n(),a("tr",{key:e.key},[s("td",{style:{"text-align":"center",cursor:"pointer"},onClick:()=>d(r).selectedKeys[e.key]=!d(r).selectedKeys[e.key]},[i(s("input",{type:"checkbox","onUpdate:modelValue":t=>d(r).selectedKeys[e.key]=t},null,8,Ul),[[T,d(r).selectedKeys[e.key]]])],8,Rl),s("td",null,[Ll,s("a",{href:`#path=${e.key}`,onClick:t=>w(e.key)},h(e.key.split(d(_).delimiter).slice(-1)[0]||d(_).delimiter),9,_l)]),Fl,Nl,Ml])))),128)),(n(!0),a(v,null,k(d(C).filter((e=>"PATH"===e.type&&e.key.split(d(_).delimiter).slice(-1)[0])),(e=>(n(),a("tr",{key:e.key},[s("td",{style:{"text-align":"center",cursor:"pointer"},onClick:()=>d(r).selectedKeys[e.key]=!d(r).selectedKeys[e.key]},[i(s("input",{type:"checkbox","onUpdate:modelValue":t=>d(r).selectedKeys[e.key]=t},null,8,Kl),[[T,d(r).selectedKeys[e.key]]])],8,zl),s("td",null,h(e.key.split(d(_).delimiter).slice(-1)[0]),1),s("td",Wl,h(e.lastModified),1),s("td",Vl,h(e.storageClass),1),s("td",ql,h(d(mt)(e.size)),1)])))),128))])])):u("",!0)])])]),d(_).tokens&&d(_).currentBucket?(n(),a("div",{key:0,class:"panel panel-success",onClick:t[8]||(t[8]=e=>d(_).showUploads=!0),style:{cursor:"pointer"}},Hl)):u("",!0),s("div",Gl,[d(_).showSettings?(n(),O(Re,{key:0})):u("",!0),d(_).showBucketSelector?(n(),O(ht,{key:1})):u("",!0),d(_).showAddFolder?(n(),O(Kt,{key:2})):u("",!0),d(_).showTrash?(n(),O(mo,{key:3,selectedKeys:Object.keys(d(r).selectedKeys).filter((e=>d(r).selectedKeys[e])),onTrashCompleted:g},null,8,["selectedKeys"])):u("",!0),d(_).showUploads?(n(),O(Go,{key:4,filesToUpload:d(r).filesToUpload,onUploadsCompleted:g},null,8,["filesToUpload"])):u("",!0)]),m(Qo)])),_:1}))},__scopeId:"data-v-0e49523c"};const Jl=B({setup:e=>(e,t)=>(n(),O(Yl))});Jl.use($,{autoSetContainer:!0,appendToBody:!0}),AWS.config.update({region:""}),AWS.config.update({signatureVersion:"v4"}),Jl.mount("#app");

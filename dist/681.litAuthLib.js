"use strict";(this.webpackChunklitAuthLib=this.webpackChunklitAuthLib||[]).push([[681],{12681:(e,t,r)=>{function n(e){const t=new Uint8Array(e);let r="";for(const e of t)r+=String.fromCharCode(e);return btoa(r).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}function o(e){const t=e.replace(/-/g,"+").replace(/_/g,"/"),r=(4-t.length%4)%4,n=t.padEnd(t.length+r,"="),o=atob(n),a=new ArrayBuffer(o.length),i=new Uint8Array(a);for(let e=0;e<o.length;e++)i[e]=o.charCodeAt(e);return a}function a(){return void 0!==window?.PublicKeyCredential&&"function"==typeof window.PublicKeyCredential}function i(e){const{id:t}=e;return{...e,id:o(t),transports:e.transports}}function s(e){return"localhost"===e||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e)}r.d(t,{startAuthentication:()=>w,startRegistration:()=>h});class c extends Error{constructor({message:e,code:t,cause:r,name:n}){super(e,{cause:r}),this.name=n??r.name,this.code=t}}const l=new class{createNewAbortSignal(){if(this.controller){const e=new Error("Cancelling existing WebAuthn API call for new one");e.name="AbortError",this.controller.abort(e)}const e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){const e=new Error("Manually cancelling existing WebAuthn API call");e.name="AbortError",this.controller.abort(e),this.controller=void 0}}},u=["cross-platform","platform"];function d(e){if(e&&!(u.indexOf(e)<0))return e}async function h(e){if(!a())throw new Error("WebAuthn is not supported in this browser");const t={publicKey:{...e,challenge:o(e.challenge),user:{...e.user,id:o(e.user.id)},excludeCredentials:e.excludeCredentials?.map(i)}};let r;t.signal=l.createNewAbortSignal();try{r=await navigator.credentials.create(t)}catch(e){throw function({error:e,options:t}){const{publicKey:r}=t;if(!r)throw Error("options was missing required publicKey property");if("AbortError"===e.name){if(t.signal instanceof AbortSignal)return new c({message:"Registration ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:e})}else if("ConstraintError"===e.name){if(!0===r.authenticatorSelection?.requireResidentKey)return new c({message:"Discoverable credentials were required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",cause:e});if("required"===r.authenticatorSelection?.userVerification)return new c({message:"User verification was required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",cause:e})}else{if("InvalidStateError"===e.name)return new c({message:"The authenticator was previously registered",code:"ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",cause:e});if("NotAllowedError"===e.name)return new c({message:e.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:e});if("NotSupportedError"===e.name)return 0===r.pubKeyCredParams.filter((e=>"public-key"===e.type)).length?new c({message:'No entry in pubKeyCredParams was of type "public-key"',code:"ERROR_MALFORMED_PUBKEYCREDPARAMS",cause:e}):new c({message:"No available authenticator supported any of the specified pubKeyCredParams algorithms",code:"ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",cause:e});if("SecurityError"===e.name){const t=window.location.hostname;if(!s(t))return new c({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:e});if(r.rp.id!==t)return new c({message:`The RP ID "${r.rp.id}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:e})}else if("TypeError"===e.name){if(r.user.id.byteLength<1||r.user.id.byteLength>64)return new c({message:"User ID was not between 1 and 64 characters",code:"ERROR_INVALID_USER_ID_LENGTH",cause:e})}else if("UnknownError"===e.name)return new c({message:"The authenticator was unable to process the specified options, or could not create a new credential",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:e})}return e}({error:e,options:t})}if(!r)throw new Error("Registration was not completed");const{id:u,rawId:h,response:w,type:p}=r;let E,g,f,A;if("function"==typeof w.getTransports&&(E=w.getTransports()),"function"==typeof w.getPublicKeyAlgorithm)try{g=w.getPublicKeyAlgorithm()}catch(e){R("getPublicKeyAlgorithm()",e)}if("function"==typeof w.getPublicKey)try{const e=w.getPublicKey();null!==e&&(f=n(e))}catch(e){R("getPublicKey()",e)}if("function"==typeof w.getAuthenticatorData)try{A=n(w.getAuthenticatorData())}catch(e){R("getAuthenticatorData()",e)}return{id:u,rawId:n(h),response:{attestationObject:n(w.attestationObject),clientDataJSON:n(w.clientDataJSON),transports:E,publicKeyAlgorithm:g,publicKey:f,authenticatorData:A},type:p,clientExtensionResults:r.getClientExtensionResults(),authenticatorAttachment:d(r.authenticatorAttachment)}}function R(e,t){console.warn(`The browser extension that intercepted this WebAuthn API call incorrectly implemented ${e}. You should report this error to them.\n`,t)}async function w(e,t=!1){if(!a())throw new Error("WebAuthn is not supported in this browser");let r;0!==e.allowCredentials?.length&&(r=e.allowCredentials?.map(i));const u={...e,challenge:o(e.challenge),allowCredentials:r},h={};if(t){if(!await function(){if(!a())return new Promise((e=>e(!1)));const e=window.PublicKeyCredential;return void 0===e.isConditionalMediationAvailable?new Promise((e=>e(!1))):e.isConditionalMediationAvailable()}())throw Error("Browser does not support WebAuthn autofill");if(document.querySelectorAll("input[autocomplete$='webauthn']").length<1)throw Error('No <input> with "webauthn" as the only or last value in its `autocomplete` attribute was detected');h.mediation="conditional",u.allowCredentials=[]}let R;h.publicKey=u,h.signal=l.createNewAbortSignal();try{R=await navigator.credentials.get(h)}catch(e){throw function({error:e,options:t}){const{publicKey:r}=t;if(!r)throw Error("options was missing required publicKey property");if("AbortError"===e.name){if(t.signal instanceof AbortSignal)return new c({message:"Authentication ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:e})}else{if("NotAllowedError"===e.name)return new c({message:e.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:e});if("SecurityError"===e.name){const t=window.location.hostname;if(!s(t))return new c({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:e});if(r.rpId!==t)return new c({message:`The RP ID "${r.rpId}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:e})}else if("UnknownError"===e.name)return new c({message:"The authenticator was unable to process the specified options, or could not create a new assertion signature",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:e})}return e}({error:e,options:h})}if(!R)throw new Error("Authentication was not completed");const{id:w,rawId:p,response:E,type:g}=R;let f;return E.userHandle&&(f=n(E.userHandle)),{id:w,rawId:n(p),response:{authenticatorData:n(E.authenticatorData),clientDataJSON:n(E.clientDataJSON),signature:n(E.signature),userHandle:f},type:g,clientExtensionResults:R.getClientExtensionResults(),authenticatorAttachment:d(R.authenticatorAttachment)}}}}]);
import { firebase, firebaseui } from 'firebaseui-angular';

const FIREBASEUI_AUTH_CONFIG: firebaseui.auth.Config = {
    signInFlow: 'popup',
    signInSuccessUrl: 'tab',
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    tosUrl: '/terms',
    privacyPolicyUrl: '/privacy',
    credentialHelper: firebaseui.auth.CredentialHelper.ACCOUNT_CHOOSER_COM
};

export default FIREBASEUI_AUTH_CONFIG;
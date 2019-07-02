import Auth0Lock from 'auth0-lock';

//define out auth0 lock options
//https://auth0.com/docs/libraries/lock/v11/configuration
const lockOptions = {
  rememberLastLogin: false,
  allowForgotPassword: false,
  prefill: {
    email: 'guest@auth0webtaskapp.com'
  },
  theme: {
    primaryColor: '#0d2f52',
    labeledSubmitButton: false
  },
  languageDictionary: {
    emailInputPlaceholder: 'guest@auth0webtaskapp.com',
    title: 'Top Secret Area'
  },
  auth: {
    //our callback url once we have the token
    redirectUrl: window.location.href,
    responseType: 'token id_token'
  }
};

//configure your auth0 lock based on your chosen application settings in your
//auth0 account
let lock = new Auth0Lock(
  'vKWqEiz2SqjbtpZIAAqSccpzibaFZkzc',
  'adesmier.auth0.com',
  lockOptions
);

lock.on('authenticated', authResult => {
  //once authenticated save token to local storage
  lock.getUserInfo(authResult.accessToken, (error, profile) => {
    if (error) return alert(error.message);
    localStorage.setItem('auth0-webtask-app-access-token', authResult.idToken);
  });
});

export default {

  showLock: function() {
    lock.show();
  },

  removeToken: function() {
    localStorage.removeItem('auth0-webtask-app-access-token');
  }

};

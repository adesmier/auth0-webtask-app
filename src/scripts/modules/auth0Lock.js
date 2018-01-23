import Auth0Lock from 'auth0-lock';

const lockOptions = {
  rememberLastLogin: false,
  allowForgotPassword: false,
  prefill: {
    email: 'guest@adesmier.com'
  },
  theme: {
    primaryColor: '#0d2f52',
    labeledSubmitButton: false
  },
  languageDictionary: {
    emailInputPlaceholder: 'guest@adesmier.com',
    title: 'Top Secret Area'
  },
  auth: {
    redirectUrl: 'http://localhost:3000',
    responseType: 'token id_token'
  }
};

let lock = new Auth0Lock(
  'vKWqEiz2SqjbtpZIAAqSccpzibaFZkzc',
  'adesmier.auth0.com',
  lockOptions
);

lock.on('authenticated', function(authResult) {
  //once authenticated...
  lock.getUserInfo(authResult.accessToken, function(error, profile) {
    if (error) {
      return alert(error.message);
    }

    //profile = insertExpiresDate(profile); //valid for 24 hours
    localStorage.setItem('auth0-webtask-app-access-token', authResult.idToken);
    //localStorage.setItem('test-auth0-profile', JSON.stringify(profile));
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

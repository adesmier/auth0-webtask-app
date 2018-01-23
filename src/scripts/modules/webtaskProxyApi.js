//promise polyfill for IE
//require('es6-promise').polyfill();

import axios from 'axios';

//webtask contentful api endpoint
let url =
  'https://wt-26212ff75758b7d16d19104dea3bca60-0.run.webtask.io/auth0-webtask-app/users';

export default {
  getContent: function() {
    let authToken = localStorage.getItem('auth0-webtask-app-access-token');
    let headers = {headers: {Authorization: 'Bearer ' + authToken}};

    if (authToken) {
      return axios
        .get(url, headers)
        .then(response => {
          return {
            status: response.status,
            data: response.data
          };
        })
        .catch(error => {
          return {
            status: error.response.data.status,
            data: error.response.data.message
          };
        });
    } else {
      return new Promise(function(resolve, reject) {
        reject('Auth token does not exist');
      });
    }
  }
};

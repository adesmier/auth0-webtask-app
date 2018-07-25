import axios from 'axios';

//our webtask endpoint and route using the run.webtask.io domain
let url =
  'https://wt-26212ff75758b7d16d19104dea3bca60-0.run.webtask.io/auth0-webtask-app/users';

export default {
  getContent: () => {
    //do we already have an item stored?
    let authToken = localStorage.getItem('auth0-webtask-app-access-token');
    //must use Bearer as the authorization method
    let headers = {headers: {Authorization: 'Bearer ' + authToken}};

    if(authToken) {
      return axios
        .get(url, headers)
        .then(response => {
          //we've successfully authenticated so return the response
          return {
            status: response.status,
            data: response.data
          };
        })
        //there was an error so let's handle that
        .catch(error => {
          return {
            status: error.response.data.status,
            data: error.response.data.message
          };
        });
    } else {
      //we'll reject if there is no auth token stored
      return new Promise((resolve, reject) => {
        reject('Auth token does not exist');
      });
    }
  }
};

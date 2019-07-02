# Auth0 Webtask App
Prototype that demonstrates authentication to a static web page. The main page is rendered using React, but the [data](https://jsonplaceholder.typicode.com/users) is behind an authentication layer. Authentication is done via the [Auth0 Lock](https://auth0.com/docs/libraries/lock/v11) app which verifies the login details with it's own database and sends back an auth token. This is then used in a [Webtask](https://webtask.io/) serverless function to make the API call to JSON Placeholder and then sends back the data to be rendered.

Below is the code used in the Webtask function:

```javascript
const app = new (require('express'))();
const wt = require('webtask-tools');
const request = require('request');
const bodyParser = require('body-parser');

//we'll use jsonplaceholder to get our fake data
const apiBaseUrl = 'https://jsonplaceholder.typicode.com';

//our custom api error responses
const RESPONSE = {
  ERROR: {
    statusCode: 400,
    message: 'Error from Webtask: Something went wrong. Please try again later.'
  },
  UNAUTHORIZED: {
    status: 401,
    message: 'Error from Webtask: You\'re not currently authorized to view this content. Please login.'
  }
};

//https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express
//parse the body of the request otherwise it won't work
app.use(bodyParser.json());

app.get('/users', (req, res) => {
    const requestUrl = `${apiBaseUrl}/users`;

    //request the data from jsonplaceholder user endpoint and send it back to the client
    request(requestUrl, (error, response, body) => {
      if(error){
        res.writeHead(400, { 'Content-Type': 'application/json'});
        res.end(JSON.stringify(RESPONSE.ERROR));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json'});
        res.end(body);
      }
    });

});

//here we are exporting our express app using the wt helper
//library and using auth0 to secure the apps endpoints
module.exports = wt.fromExpress(app).auth0({
  //implementing a custom login error function which will send
  //the user an appropriate message if the request is not authorized
  loginError: (error, ctx, req, res) => {
        res.writeHead(401, { 'Content-Type': 'application/json'});
        res.end(JSON.stringify(RESPONSE.UNAUTHORIZED));
  }
});
```

#### Build Steps
`npm install`
`npm start`

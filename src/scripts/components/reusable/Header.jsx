import React from 'react';

export default () => {
  return (
    <React.Fragment>
      <h2>Securing a Static Web Page with Auth0 and Webtask</h2>
      <h6>
        We use the <a href="https://auth0.com/docs/libraries/lock/v11"
        target="_blank" rel="noopener noreferrer">Auth0 Lock</a> app to generate
        an authentication token for us and then have the data we want to display
        be retrieved by our <a href="https://webtask.io/" target="_blank"
        rel="noopener noreferrer">Webtask</a> app. Our Webtask app requires the
        auth token in order to send back the data from <a
        href="https://jsonplaceholder.typicode.com" target="_blank"
        rel="noopener noreferrer">JSON Placeholder</a>, otherwise it displays an
        authentication error.
      </h6>
    </React.Fragment>
  );
}

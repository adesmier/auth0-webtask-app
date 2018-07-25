import React from 'react';

import Loading from './Loading';
import User from './User';
import Button from './Button';

import Auth0Lock from '../../modules/auth0Lock';
import ajax from '../../modules/webtaskProxyApi';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: null,
      intervalCounter: 0
    };
  }

  //React life cycle functions - START

  componentDidMount() {
    this.initRequest();
  }

  componentWillUnmount() {
    clearInterval(this.ajaxInterval);
  }

  //React life cycle functions - END

  initRequest() {
    //we'll run our ajax request in a setInterval to allow enough time for the
    //returned token to be written to disk
    this.ajaxInterval = setInterval(this.requestData, 1000);
  }

  requestData = () => {
    ajax
      .getContent()
      .then(data => {
        //a token was found in local storage so clear the interval and update
        //state with our data
        clearInterval(this.ajaxInterval);
        this.setState({apiData: data});
      })
      .catch(error => {
        //allow 3 attempts to get token
        console.log('Interval is: ', this.state.intervalCounter);
        if (this.state.intervalCounter === 3) {
          //after our interval has elapsed, we can be confident that we don't
          //have an authentication token so let's request the user to login
          clearInterval(this.ajaxInterval);
          this.setState({
            apiData: {
              status: 401,
              data: 'Please login to access the Client Page'
            }
          });
          return;
        }
        this.setState({
          intervalCounter: this.state.intervalCounter + 1
        });
      });
  };

  applyFakeClickHandler =() => {
    localStorage.setItem(
      'auth0-webtask-app-access-token',
      'SOME43534FAKE45645TOKEN'
    );
    this.initRequest();
    this.setState({ apiData: null })
  }

  removeClickHandler = () => {
    Auth0Lock.removeToken();
    this.setState({
      apiData: {
        status: 401,
        data: 'Token cleared. Please login in again'
      }
    });
  }

  render() {
    const { apiData } = this.state;
    
    if(apiData) {
      console.log(apiData);
      const {status, data} = apiData;

      if(status === 401) {
        //we need to ask the user to login
        return (
          <div>
            <p>{data}</p>
            <Button 
              title='Login'
              clickHandler={Auth0Lock.showLock}
            />
            <br />
            <p>
              Try to apply a fake token to try and bypass authentication and we
              get an error from our webtask
            </p>
            <Button 
              title='Apply Fake Token'
              clickHandler={this.applyFakeClickHandler}
            />
          </div>
        );
      } else if(status === 200) {
        //we have the data so lets display it
        let users = data.map(user => (
          <User
            key={user.id}
            name={user.name}
            email={user.email}
            city={user.address.city}
          />
        ));

        //provide an option to clear the token
        return(
          <div>
            <Button 
              title='Clear Token'
              clickHandler={this.removeClickHandler}
            />
            {users}
          </div>
        )

      }
    } else {
      //loading is display on first mount then we'll check to see if
      //credentials are stored in local storage
      return <Loading />;
    }
  }

}

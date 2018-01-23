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
    //allow time for token to be written to disk after url redirect
    this.ajaxInterval = setInterval(this.requestData, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.ajaxInterval);
  }

  //React life cycle functions - END

  requestData = () => {
    ajax
      .getContent()
      .then(data => {
        clearInterval(this.ajaxInterval); //a token was found in local storage
        this.setState({apiData: data});
      })
      .catch(error => {
        //allow 3 attempts to get token
        console.log('Interval is: ', this.state.intervalCounter);
        if (this.state.intervalCounter === 3) {
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

  clickHandler = () => {
    Auth0Lock.removeToken();
    this.setState({
      apiData: {
        status: 401,
        data: 'Token cleared. Please login in again'
      }
    });
  }

  render() {
    
    if (this.state.apiData) {

      console.log(this.state.apiData);
      let {status, data} = this.state.apiData;

      if (status === 401) {
        return (
          <div>
            <p>{data}</p>
            <Button 
              title='Login'
              clickHandler={Auth0Lock.showLock}
            />
          </div>
        );
      } else if (status === 200) {

        let users = data.map(user => (
          <User
            key={user.id}
            name={user.name}
            email={user.email}
            city={user.address.city}
          />
        ));

        return(
          <div>
            <Button 
              title='Clear Token'
              clickHandler={this.clickHandler}
            />
            {users}
          </div>
        )

      }

    } else {
      return <Loading />;
    }
    
  }
}

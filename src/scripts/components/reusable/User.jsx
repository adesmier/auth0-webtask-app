import React from 'react';

export default props => {
  let {name, email, city} = props;
  return (
    <div>
      <h5>{name}</h5>
      <p>Email: {email}</p>
      <p>City: {city}</p>
    </div>
  );
}

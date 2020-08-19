import React from 'react';
import { Button } from '@blueprintjs/core';
// import icon from '../assets/graphics/favicon.ico';

export default (props) => {
  console.log('Props in home', props);
  return (
    <div>wel come to home page
      <Button text="hlw this is from blueprint js" intent="success"/>
      <img src='assets/graphics/favicon.ico'/>
    </div>
  );
}
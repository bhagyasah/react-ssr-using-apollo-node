import React from 'react';
import { Route, Switch } from 'react-router';
import Signin from './pages/SignInPage';
import Home from './pages/Home';

const Root = ({ refetch, session }) =>
  <Switch>
    <Route path="/signin" render={props => (
      <Signin {...props} refetch={refetch} />
    )} />
    <Route path="/" render={props => (

      <Home {...props} />
    )} />
  </Switch>
  ;

export default Root;

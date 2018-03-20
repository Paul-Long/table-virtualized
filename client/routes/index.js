import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import App from '@containers/app';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path='/' exact component={App}/>
    </Switch>
  </BrowserRouter>
)

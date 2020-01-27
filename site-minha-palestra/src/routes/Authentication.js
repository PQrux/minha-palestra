import React, { Component } from 'react';
import { multiStorager } from '../utils';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Splash, Login } from "../views";
export default class Root extends Component {
    constructor(props){
        super(props);
    }
    render() {
      return (
        <BrowserRouter>
          <Switch>
            <Route path="*" component={Login}/>
            <Route path="*" component={Login}/>
            <Route path="*" component={Login}/>
          </Switch>
        </BrowserRouter>
      )
    }
}

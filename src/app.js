import React, { Component } from "react";
import { Switch, Route } from "react-router";
import AuthModule from "./components/auth_module/auth_module";
import HomePage from "./components/home_page/home_page";
import RegModule from "./components/reg_module/reg_module";
import "./app.scss";

class App extends Component {
  render() {
    return (
      <div className="cp-app-head_body">
        <Switch>
          <Route exact path="/" component={AuthModule} />
          <Route exact path="/registration" component={RegModule} />
          <Route exact path="/home" component={HomePage} />
        </Switch>
        <AuthModule />
      </div>
    );
  }
}

export default App;

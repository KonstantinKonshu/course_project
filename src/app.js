import React, { Component } from "react";
import { Switch, Route } from "react-router";
import AuthModule from "./components/user_authorizations/auth_module";
import HomePage from "./components/home_page/home_page";
import "./app.scss";

class App extends Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <div className="cp-app-head_body">
        <Switch>
          <Route exact path="/" component={AuthModule} />
          <Route exact path="/home" component={HomePage} />
        </Switch>
        <AuthModule />
      </div>
    );
  }
}

export default App;

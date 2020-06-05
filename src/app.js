import React, { Component } from "react";
import AuthModule from "./components/user_authorizations/auth_module";
import "./app.scss";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="cp-app-head_body">
        <AuthModule />
      </div>
    );
  }
}

export default App;

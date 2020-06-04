import React, { Component } from "react";
import UserAuthorizations from "./components/user_authorizations/user_authorizations";
import "./app.scss";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="cp-app-head_body">
        <UserAuthorizations />
      </div>
    );
  }
}

export default App;

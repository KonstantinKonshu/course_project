import React, { Component } from "react";
import "./auth_module.scss";

class AuthModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_user: "",
      password: ""
    };
  }

  render() {
    console.log("this.state", this.state);
    console.log("this.props", this.props);
    return (
      <div className="cp-ua-auth_main_container">
        <div className="cp-ua-auth_form">
          <div className="cp-ua-auth_form-header">Authorization</div>

          <input
            name="login"
            className="cp-ua-auth_form-input_email"
            type="text"
            placeholder="Login"
            onChange={e => {
              this.setState({
                login_user: e.target.value
              });
            }}
            value={this.state.login_user}
          />

          <input
            className="cp-ua-auth_form-input_password"
            type="password"
            placeholder="Password"
            onChange={e => {
              this.setState({
                password: e.target.value
              });
            }}
            value={this.state.password}
          />

          <div
            className="cp-ua-auth_form-btn_login"
            onClick={() => {
              console.log("Hello btn");
            }}
          >
            LOGIN
          </div>
        </div>
      </div>
    );
  }
}

export default AuthModule;

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import "./auth_module.scss";
import { setUser } from "../../actions/actions";

class AuthModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_user: "",
      password: ""
    };
  }

  checkAuth() {
    const path = require("path");
    const fs = require("fs");
    const dir = path.join(__dirname, "../tmp");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
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
              this.checkAuth();
              // this.props.setUser(this.state.login_user, this.state.password);
              // this.props.history.push("/home");
            }}
          >
            LOGIN
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // searchRouting: state.routing.locationBeforeTransitions.search,
  // routeName: state.routing.locationBeforeTransitions.pathname,
  // searchName: state.videosReducer.search,
  // prevPageToken: state.tokensReducer.prevPageToken,
  // nextPageToken: state.tokensReducer.nextPageToken,
});
const mapDispatchToProps = dispatch => ({
  setUser: bindActionCreators(setUser, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthModule);

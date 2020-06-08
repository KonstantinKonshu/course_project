import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ErrorMsgBD from "../error_BD_message/error_msg_BD";
// import { isDirSync, encrypt } from "../../helpers";
import { setUser } from "../../actions/actions";
import { folderPath } from "../../constants";
import "./auth_module.scss";

// const path = require("path");
// const fs = require("fs");
// const md5 = require("md5");
const { ipcRenderer } = require("electron");
// const keytar = require("keytar");
// const { ipcRenderer } = require("electron");

class AuthModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_user: "",
      password: "",
      is_empty_dir: false
    };
  }

  componentDidMount() {
    console.log("componentDidMount");

    // console.log("123456", encrypt("SOCIATE_MINERALE"));
    // console.log("123456", ipcRenderer.sendSync("check_directory", folderPath));
    this.setState({ is_empty_dir: ipcRenderer.sendSync("check_directory", folderPath) });
  }

  checkAuth() {
    // if (this.state.is_empty_dir && this.state.login_user === "admin" && this.state.password === "admin") {
    //   this.props.setUser(this.state.login_user, this.state.password);
    //   this.props.history.push("/home");
    // }
    // const dir = path.join(folderPath);
    // console.log("existsSync", fs.existsSync(folderPath));
    // if (!fs.existsSync(folderPath)) {
    // fs.mkdirSync(folderPath);
    // }
  }

  regAdmin() {
    ipcRenderer.send("set-password-admin", this.state.login_user, this.state.password);
    this.props.setUser(this.state.login_user, this.state.password);
    this.props.history.push("/home");
  }

  render() {
    console.log("this.state", this.state);
    console.log("this.props", this.props);
    return (
      <div className="cp-ua-auth_main_container">
        <div className="cp-ua-auth_form">
          <div className="cp-ua-auth_form-header">
            {this.state.is_empty_dir ? "Registration Admin" : "Authorization"}
          </div>

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
              this.state.is_empty_dir ? this.regAdmin() : this.checkAuth();
            }}
          >
            LOGIN
          </div>
          {this.state.is_empty_dir && <ErrorMsgBD />}
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
  // channelId: state.channelsReducer.channelId
});
const mapDispatchToProps = dispatch => ({
  setUser: bindActionCreators(setUser, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthModule);

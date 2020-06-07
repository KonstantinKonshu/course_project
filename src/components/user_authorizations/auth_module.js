import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ErrorMsgBD from "../error_BD_message/error_msg_BD";
import { isDirSync, encrypt } from "../../helpers";
import { setUser } from "../../actions/actions";
import { folderPath } from "../../constants";
import "./auth_module.scss";

const path = require("path");
const fs = require("fs");
const md5 = require("md5");
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

    console.log("123456", encrypt("SOCIATE_MINERALE"));
    if (!isDirSync(folderPath)) {
      this.setState({ is_empty_dir: true });
      // fs.mkdirSync(folderPath);
    }

    // fs.access();
    // if (fs.existsSync(folderPath)) {
    // } else {
    //   fs.mkdirSync(folderPath);
    // }
  }

  checkAuth() {
    if (this.state.is_empty_dir && this.state.login_user === "admin" && this.state.password === "admin") {
      this.props.setUser(this.state.login_user, this.state.password);
      this.props.history.push("/home");
    }

    // const dir = path.join(folderPath);
    // console.log("existsSync", fs.existsSync(folderPath));
    // if (!fs.existsSync(folderPath)) {
    // fs.mkdirSync(folderPath);
    // }
  }

  regAdmin() {
    console.log(ipcRenderer.sendSync("synchronous-message", "ping")); // prints "pong"

    ipcRenderer.on("asynchronous-reply", (event, arg) => {
      console.log(arg); // prints "pong"
    });
    ipcRenderer.send("asynchronous-message", "ping");

    // fs.mkdirSync(folderPath);
    // const keytar = require("keytar");
    ipcRenderer.send("set-password", this.state.login_user, this.state.password);
    // try {
    //   keytar
    //     .setPassword("test", "this.state.login_user", "md5(this.state.password)")
    //     .then(res => console.log("r", res));
    // } catch (e) {
    //   console.log(e);
    // }
    // keytar.setPassword("KeytarTest", "AccountName", "secret").then(r => console.log(r));
    // const secret = keytar.getPassword("KeytarTest", "AccountName");
    // secret.then(result => {
    //   console.log("result: " + result); // result will be 'secret'
    // });
    // console.log("PWD", keytar.getPassword("course_project", this.state.login_user));
    // fs.writeFileSync(path.join(folderPath, "register_user.txt"), "Привет ми ми ми!");
  }

  render() {
    console.log("this.state", this.state);
    console.log("this.props", this.props);
    return (
      <div className="cp-ua-auth_main_container">
        <div className="cp-ua-auth_form">
          <div className="cp-ua-auth_form-header">
            {this.state.is_empty_dir ? "Registration" : "Authorization"}
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
              // console.log(md5("admin12345QWERTY"));
              this.state.is_empty_dir ? this.regAdmin() : this.checkAuth();
              // this.props.setUser(this.state.login_user, this.state.password);
              // this.props.history.push("/home");
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

import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ErrorMsgBD from "../error_BD_message/error_msg_BD";
// import { isDirSync, encrypt } from "../../helpers";
import { setUser } from "../../actions/actions";
import { folderPath } from "../../constants";
import "../auth_module/auth_module.scss";

// const path = require("path");
// const fs = require("fs");
// const md5 = require("md5");
const { ipcRenderer } = require("electron");

class RegModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_user: "",
      password: "",
      is_empty_dir: false,
      msg: ""
      // required_admin: false
      // is_no_registration: false
    };
  }

  componentDidMount() {
    console.log("componentDidMount---RegModule");
    const is_reg_users_exist = ipcRenderer.sendSync("CHECK_REG_USERS");
    if (!is_reg_users_exist) {
      console.log("is_reg_users_exist-REG", false);
      if (ipcRenderer.sendSync("CHECK_DIRECTORY")) {
        this.setState({ msg: "No files, administrator required", is_empty_dir: true });
      }
    } else {
      console.log("TRUE ))))");
      // this.setState({ required_admin: true });
    }
  }

  checkRegistration() {
    const is_exist = ipcRenderer.sendSync("CHECK_USER_EXIST", this.state.login_user);
    if (is_exist) {
      //он уже сушществует
      console.log("0000", is_exist);
      this.setState({ msg: "A user with this login already exists.", password: "" });
    } else {
      // можно регать
      if (
        ipcRenderer.sendSync(
          "REGISTRATION_USER",
          this.state.login_user,
          this.state.password,
          this.state.is_empty_dir
        )
      ) {
        this.props.setUser(this.state.login_user, this.state.password);
        console.log("YES");
        this.props.history.push("/home");
      }
    }

    // const is_check_auth_user = ipcRenderer.sendSync("CHECK_AUTH_USER", this.state.login_user, this.state.password);
    // if (res) {
    //   this.props.setUser(this.state.login_user, this.state.password);
    //   console.log("YES");
    //   this.props.history.push("/home");
    // } else {
    //   console.log("NO");
    //   this.setState({
    //     // is_no_registration: true,
    //     password: ""
    //   });
    // }
  }

  render() {
    console.log("this.state", this.state);
    console.log("this.props", this.props);
    return (
      <div className="cp-ua-auth_main_container">
        <div className="cp-ua-auth_form">
          <div className="cp-ua-auth_form-header">Registration</div>

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
              this.checkRegistration();
            }}
          >
            Register
          </div>
          <div
            className="cp-ua-auth_form-btn_login"
            onClick={() => {
              console.log("Hello btn");
              this.props.history.push("/");
            }}
          >
            Back
          </div>

          <ErrorMsgBD mes={this.state.msg} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // channelId: state.channelsReducer.channelId
});
const mapDispatchToProps = dispatch => ({
  setUser: bindActionCreators(setUser, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RegModule);

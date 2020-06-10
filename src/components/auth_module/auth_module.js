import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ErrorMsgBD from "../error_BD_message/error_msg_BD";
import { setUser } from "../../actions/actions";
import { folderPath } from "../../constants";
import "./auth_module.scss";

const { ipcRenderer } = require("electron");

class AuthModule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_user: "",
      password: "",
      is_empty_dir: false,
      user_not_exist: false,
      msg: ""
    };
  }

  componentDidMount() {
    console.log("componentDidMount--AuthModule", this.props);
    const is_reg_users_exist = ipcRenderer.sendSync("CHECK_REG_USERS");
    if (!is_reg_users_exist) {
      // this.props.history.push("/registration");
    } else {
      if (ipcRenderer.sendSync("CHECK_DIRECTORY")) {
        this.setState({ msg: "No files, administrator required", is_empty_dir: true });
      }
    }
  }

  checkAuth() {
    const is_check_auth = ipcRenderer.sendSync(
      "CHECK_AUTH_USER",
      this.state.login_user,
      this.state.password,
      this.state.is_empty_dir
    );
    console.log(
      "CHECK",
      ipcRenderer.sendSync(
        "CHECK_AUTH_USER",
        this.state.login_user,
        this.state.password,
        this.state.is_empty_dir
      )
    );
    if (is_check_auth) {
      this.props.setUser(this.state.login_user, this.state.password);
      console.log("YES");
      this.props.history.push("/home");
    } else {
      console.log("NO");
      const is_exist = ipcRenderer.sendSync("CHECK_USER_EXIST", this.state.login_user);
      if (is_exist) {
        this.setState({
          user_not_exist: true,
          password: "",
          msg: "Username or password entered incorrectly."
        });
      } else {
        this.setState({
          user_not_exist: true,
          password: "",
          msg: "This user does not exist."
        });
      }
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
            }}
          >
            Login
          </div>
          <div
            className="cp-ua-auth_form-btn_login"
            onClick={() => {
              console.log("Hello btn");
              this.props.history.push("/registration");
            }}
          >
            Go to registration
          </div>

          <ErrorMsgBD mes={this.state.msg} />
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

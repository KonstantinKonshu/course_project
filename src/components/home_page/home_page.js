import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import "./home_page.scss";
import { folderPath } from "../../constants";
const { ipcRenderer } = require("electron");

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_empty_dir: false,
      is_role: ""
    };
  }

  componentDidMount() {
    console.log("componentDidMount --- HP");
    this.setState({ is_empty_dir: ipcRenderer.sendSync("check_directory", folderPath) });
    console.log("is_empty_dir_2", this.state.is_empty_dir);
    // if (this.props.user_password ===0)
    // this.setState({
    //   is_role: ipcRenderer.sendSync("check-password", this.props.user_login, this.props.user_password)
    // });
    console.log(
      "checkPWD",
      ipcRenderer.send("check-password", this.props.user_login, this.props.user_password)
    );
  }

  renderWorkPanelAdmin() {
    return (
      <div>
        <div>Folder</div>
        <div>Reg-on Users</div>
        <div>List Users</div>
      </div>
    );
  }

  render() {
    return (
      <div className="cp-ua-auth_main_container">
        <div>{`Hi ${this.props.user_login}`}</div>
        {this.state.is_role === "admin" && this.renderWorkPanelAdmin()}

        {/*<div className="cp-ua-auth_form">*/}
        {/*<div>Authorization</div>*/}
        {/*</div>*/}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user_login: state.user.login,
  user_password: state.user.hash_password
});

const mapDispatchToProps = dispatch => ({
  // handleSubmitInit: bindActionCreators(handleSubmitInit, dispatch),
  // getRequestSearch: bindActionCreators(getRequestSearch, dispatch),
  // setError: bindActionCreators(setError, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

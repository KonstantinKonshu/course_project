import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { selectDirectory } from "../../actions/actions";
// import Table from "../table/table";
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
    console.log("componentDidMount --- HP", this.props.user_login);
    console.log("AVATAR_USER", this.getUserAvatar(this.props.user_login));
    this.setState({ is_empty_dir: ipcRenderer.sendSync("CHECK_DIRECTORY", folderPath) });
    this.setState({
      is_role: ipcRenderer.sendSync("CHECK_PASSWORD", this.props.user_login, this.props.user_password)
    });

    console.log("USERS", ipcRenderer.sendSync("GET_REG_USERS"));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  // renderSelectDir = () => {
  //   return (
  //     <div>
  //       <h2> Select the path to the directory: </h2>
  //       <button onClick={this.props.selectDirectory}>Select directory</button>
  //       <h3>{`Selected directory: ${this.props.selectedDirectory}`}</h3>
  //     </div>
  //   );
  // };

  getUserList() {
    return ipcRenderer.sendSync("GET_REG_USERS");
  }

  getUserAvatar(user_login) {
    return ipcRenderer.sendSync("GET_AVATAR_USER", user_login);
  }

  renderListRegUser() {
    const users = this.getUserList().map((user, index) => (
      <div className="cp-hp-list_reg_users-item" key={index}>
        {/*<div className={"dir-table__td"} >*/}
        {user}
        {/*</div>*/}
      </div>
    ));

    return <div className="cp-hp-list_reg_users">{users}</div>;
  }

  renderWorkPanelAdmin() {
    const renderItems = this.getUserList().map((user, index) => (
      <div className="cp-hp-list_reg_users-item" key={index} onClick={console.log("CLICK", user)}>
        {user}
      </div>
    ));

    return (
      <div className="cp-hp-user_workpanel-item_list">
        <div className="cp-hp-item_list-header"> item list</div>
        <div className="cp-hp-item_list-body">{renderItems}</div>
      </div>
    );
  }

  // renderWorkPanelUser() {}

  render() {
    return (
      <div className="cp-hp-main_container">
        <div className="cp-hp-user_info">
          <div className="cp-hp-user_info-username">{`Welcome ${this.props.user_login}`}</div>
          <div className="cp-hp-user_info-avatar">
            <img
              src={`data:image/png;base64,${ipcRenderer.sendSync("GET_AVATAR_USER", this.props.user_login)}`}
              alt="avatar"
            />
          </div>
          <div className="cp-hp-user_info-request_btn">
            <div className="cp-hp-request_btn-change_pwd">cp-hp-request_btn-change_pwd</div>
            <div className="cp-hp-request_btn-exit">EXIT</div>
          </div>
        </div>
        <div className="cp-hp-user_workpanel">
          <div>WORK_panel</div>
          {this.state.is_role === "admin" && this.renderWorkPanelAdmin()}
        </div>

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
  // selectedDirectory: state.file.selectedDirectory
});

const mapDispatchToProps = dispatch => ({
  // handleSubmitInit: bindActionCreators(handleSubmitInit, dispatch),
  // getRequestSearch: bindActionCreators(getRequestSearch, dispatch),
  // selectDirectory: bindActionCreators(selectDirectory, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

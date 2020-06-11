import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectDirectory, addFile, setUser, openFile } from "../../actions/actions";
// import { status_pwd_success } from "../../constants";
import "./home_page.scss";
import { folderPath } from "../../constants";
const { ipcRenderer } = require("electron");

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_empty_dir: false,
      is_role: "",
      is_change_pwd: false,
      old_pwd: "",
      new_pwd: "",
      status_change_pwd: undefined,
      getting_files: []
    };
  }

  componentDidMount() {
    console.log("componentDidMount --- HP", this.props.user_login);
    console.log("componentDidMount --- HP_pwd", this.props.hash_password);
    // console.log("AVATAR_USER", this.getUserAvatar(this.props.user_login));
    this.setState({ is_empty_dir: ipcRenderer.sendSync("CHECK_DIRECTORY") });

    this.setState({
      is_role: ipcRenderer.sendSync("GET_ROLE", this.props.user_login, this.props.hash_password)
    });
    console.log(
      "componentDidMount --- HP_role",
      ipcRenderer.sendSync("GET_ROLE", this.props.user_login, this.props.hash_password)
    );
    this.getUserFile();
  }

  getUserList() {
    const result = ipcRenderer.sendSync("GET_REG_USERS");
    console.log("RESULT", result);
    return result;
  }

  getUserAvatar(user_login) {
    return ipcRenderer.sendSync("GET_AVATAR_USER", user_login);
  }

  handleOnClickChangePwd(user_login, new_pass, old_pass) {
    console.log(
      "handleOnClickChangePwd",
      ipcRenderer.sendSync("CHANGE_PASSWORD", user_login, new_pass, old_pass)
    );
    // if (ipcRenderer.sendSync("CHANGE_PASSWORD", user_login, new_pass, old_pass)) {
    //   this.status_pwd_success.show();
    // }
    this.setState({
      old_pwd: "",
      new_pwd: ""
    });
  }

  handleOnClickExit() {
    setUser(null, null);
    if (ipcRenderer.sendSync("EXIT")) this.props.history.push("/");
  }

  renderWorkPanelAdmin() {
    const renderItems = this.getUserList().map((user, index) => {
      return (
        <div className="cp-hp-user_list-item" key={index}>
          <div className="cp-hp-user_list-item_title">{user}</div>
          <div className="cp-hp-user_list-item_info" onClick={() => console.log("CLICK")}>
            View
          </div>
        </div>
      );
    });

    const renderBtnChangeDir = () => {
      return (
        <div
          className="cp-hp-request_btn-btn"
          onClick={() => {
            console.log("Hello btn");
            this.props.selectDirectory();
            // this.setState({ is_change_pwd: !this.state.is_change_pwd });
          }}
        >
          Create_directory
        </div>
      );
    };

    return (
      <div>
        {true && renderBtnChangeDir()}
        <div className="cp-hp-admin_workpanel-user_list">
          <div className="cp-hp-item_list-header">
            <div className="cp-hp-user_list-item_title">User</div>
            <div className="cp-hp-user_list-item_info">Action</div>
          </div>
          <div className="cp-hp-user_list-body">{renderItems}</div>
        </div>
      </div>
    );
  }

  getUserFile() {
    this.setState({
      getting_files: ipcRenderer.sendSync("GET_USER_FILES")
    });
    // const result = ipcRenderer.sendSync("GET_USER_FILES");
    // console.log("RESULT", result);
    // return result;
  }

  renderWorkPanelUser() {
    const renderFiles = this.state.getting_files.map((file, index) => {
      return (
        <div className="cp-hp-file_list-item" key={index}>
          <div className="cp-hp-file_list-item_title">{file}</div>
          <div className="cp-hp-file_list-item_info">
            <img
              src={`data:image/png;base64,${ipcRenderer.sendSync("GET_EYE")}`}
              alt="eye"
              onClick={() => {
                console.log("CLICK");
                this.props.openFile(file);
              }}
            />
          </div>
        </div>
      );
    });

    const renderBtnAddFiles = () => {
      return (
        <div
          className="cp-hp-user_workpanel-btn_load_file"
          onClick={() => {
            console.log("Hello btn");
            this.props.addFile();
            this.getUserFile();
          }}
        >
          Add_files
        </div>
      );
    };

    return (
      <div className="cp-hp-user_workpanel">
        <div className="cp-hp-user_workpanel-header">My Files</div>
        <div className="cp-hp-user_workpanel-file_list">{renderFiles}</div>
        {renderBtnAddFiles()}
      </div>
    );
  }

  renderUserInfo() {
    return (
      <div className="cp-hp-user_info">
        <div className="cp-hp-user_info-username">{`Welcome ${this.props.user_login}`}</div>
        <div className="cp-hp-user_info-avatar">
          <img
            src={`data:image/png;base64,${ipcRenderer.sendSync("GET_AVATAR_USER", this.props.user_login)}`}
            alt="avatar"
          />
        </div>
        <div className="cp-hp-user_info-request_btn">
          <div
            className="cp-hp-request_btn-btn"
            onClick={() => {
              console.log("Hello btn");
              this.setState({ is_change_pwd: !this.state.is_change_pwd });
            }}
          >
            Change password
          </div>
          <div
            className="cp-hp-request_btn-btn"
            onClick={() => {
              console.log("Hello btn123");
              this.handleOnClickExit();
            }}
          >
            EXIT
          </div>
        </div>
      </div>
    );
  }

  renderChangePassword() {
    return (
      <div className="cp-hp-workpanel-change_pwd">
        {/*{this.renderStatusChanges()}*/}
        <input
          name="old_password"
          className="cp-hp-change_pwd-input"
          type="password"
          placeholder="Old password"
          onChange={e => {
            this.setState({
              old_pwd: e.target.value
            });
          }}
          value={this.state.old_pwd}
        />
        <input
          name="new_password"
          className="cp-hp-change_pwd-input"
          type="password"
          placeholder="New password"
          onChange={e => {
            this.setState({
              new_pwd: e.target.value
            });
          }}
          value={this.state.new_pwd}
        />
        <div
          className="cp-hp-change_pwd-btn"
          onClick={() => {
            console.log("Hello btn");
            this.handleOnClickChangePwd(this.props.user_login, this.state.new_pwd, this.state.old_pwd);
          }}
        >
          Change
        </div>
      </div>
    );
  }
  renderUserSpace() {
    return (
      <div className="cp-hp-main_container">
        {this.renderUserInfo()}
        <div className="cp-hp-workpanel">
          <div>WORK_panel</div>
          {this.state.is_change_pwd && this.renderChangePassword()}
          {this.state.is_role === "admin" ? this.renderWorkPanelAdmin() : this.renderWorkPanelUser()}
        </div>
      </div>
    );
  }

  render() {
    return this.renderUserSpace();
    // return this.props.user_password ? this.renderUserSpace() : <div>hello</div>;
  }
}

const mapStateToProps = state => ({
  user_login: state.user.login,
  hash_password: state.user.hash_password
  // selectedDirectory: state.file.selectedDirectory
});

const mapDispatchToProps = dispatch => ({
  // handleSubmitInit: bindActionCreators(handleSubmitInit, dispatch),
  // getRequestSearch: bindActionCreators(getRequestSearch, dispatch),
  setUser: bindActionCreators(setUser, dispatch),
  selectDirectory: bindActionCreators(selectDirectory, dispatch),
  addFile: bindActionCreators(addFile, dispatch),
  openFile: bindActionCreators(openFile, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

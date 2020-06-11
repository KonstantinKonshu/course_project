import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { selectDirectory, addFile, setUser, openFile } from "../../actions/actions";
import "./home_page.scss";
const { ipcRenderer } = require("electron");

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_role: "",
      is_change_pwd: false,
      old_pwd: "",
      new_pwd: "",
      getting_files: [],
      selected_user: undefined
    };
  }

  componentDidMount() {
    console.log("componentDidMount --- HP", this.props.user_login);
    console.log("componentDidMount --- HP_pwd", this.props.hash_password);
    // console.log("AVATAR_USER", this.getUserAvatar(this.props.user_login));
    // this.setState({ is_empty_dir: ipcRenderer.sendSync("CHECK_DIRECTORY") });

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

  getUserFile(selected_user = undefined) {
    this.setState({
      getting_files: ipcRenderer.sendSync("GET_USER_FILES", selected_user)
    });
  }
  handleChange = e => {
    this.setState({ selected_user: e.target.value });
    console.log("HC", this.state.selected_user);
    this.getUserFile(e.target.value);
  };

  handleOnClickChangePwd(user_login, new_pass, old_pass) {
    console.log(
      "handleOnClickChangePwd",
      ipcRenderer.sendSync("CHANGE_PASSWORD", user_login, new_pass, old_pass)
    );
    this.setState({
      old_pwd: "",
      new_pwd: ""
    });
  }

  handleOnClickExit() {
    setUser(null, null);
    if (ipcRenderer.sendSync("EXIT")) this.props.history.push("/");
  }


  renderWorkPanel() {
    const renderFiles = this.state.getting_files.map((file, index) => {
      return (
        <div className="cp-hp-file_list-item" key={index}>
          <div className="cp-hp-file_list-item_title">{file}</div>
          <div className="cp-hp-file_list-item_info">
            <img
              src={`data:image/png;base64,${ipcRenderer.sendSync("GET_EYE")}`}
              alt="eye"
              onClick={() => {
                console.log("CLICK", this.state.selected_user);
                this.props.openFile(file, this.state.selected_user);
              }}
            />
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
          }}
        >
          Select directory
        </div>
      );
    };

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

    const renderForAdmin = () => {
      const renderItems = this.getUserList().map((user, index) => {
        return (
          <option key={index} value={user}>
            {user}
          </option>
        );
      });
      return (
        <div className="qwerty">
          {renderBtnChangeDir()}
          <div className="cp-hp-admin_workpanel-user_list">
            <select
              className="cp-hp-user_list-body"
              value={this.state.selected_user}
              onChange={e => {
                this.handleChange(e);
              }}
            >
              {renderItems}
            </select>
          </div>
        </div>
      );
    };

    return (
      <div className="qwerty">
        {this.state.is_role && renderForAdmin()}
        <div className="cp-hp-user_workpanel">
          <div className="cp-hp-user_workpanel-header">Files</div>
          <div className="cp-hp-user_workpanel-file_list">{renderFiles}</div>
          {!this.state.is_role && renderBtnAddFiles()}
        </div>
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
          {this.renderWorkPanel()}
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
});

const mapDispatchToProps = dispatch => ({
  setUser: bindActionCreators(setUser, dispatch),
  selectDirectory: bindActionCreators(selectDirectory, dispatch),
  addFile: bindActionCreators(addFile, dispatch),
  openFile: bindActionCreators(openFile, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

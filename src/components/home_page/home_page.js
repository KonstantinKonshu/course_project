import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { useSelector, useDispatch } from "react-redux";
import { selectDirectory } from "../../actions/actions";
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
    this.setState({ is_empty_dir: ipcRenderer.sendSync("CHECK_DIRECTORY", folderPath) });
    this.setState({
      is_role: ipcRenderer.sendSync("CHECK_PASSWORD", this.props.user_login, this.props.user_password)
    });
  }
  renderSelectDir = () => {
    return (
      <div>
        <h2> Select the path to the directory: </h2>
        <button onClick={this.props.selectDirectory}>Select directory</button>
        <h3>{`Selected directory: ${this.props.selectedDirectory}`}</h3>
      </div>
    );
  };

  renderWorkPanelAdmin() {
    return (
      <div>
        {this.renderSelectDir()}
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
  user_password: state.user.hash_password,
  selectedDirectory: state.file.selectedDirectory
});

const mapDispatchToProps = dispatch => ({
  // handleSubmitInit: bindActionCreators(handleSubmitInit, dispatch),
  // getRequestSearch: bindActionCreators(getRequestSearch, dispatch),
  selectDirectory: bindActionCreators(selectDirectory, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

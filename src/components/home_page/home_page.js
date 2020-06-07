import React, { Component } from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import "./home_page.scss";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log("componentDidMount --- HP");
    if (this.props.user_login==="admin" && this.props.user_password==="admin"){

    }
  }

  render() {
    return (
      <div className="cp-ua-auth_main_container">
        {/*<div className="cp-ua-auth_form">*/}
        {/*<div>Authorization</div>*/}
        {/*</div>*/}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user_login: state.user.login,
  user_password : state.user.hash_password
});

const mapDispatchToProps = dispatch => ({
  // handleSubmitInit: bindActionCreators(handleSubmitInit, dispatch),
  // getRequestSearch: bindActionCreators(getRequestSearch, dispatch),
  // setError: bindActionCreators(setError, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

import React, { Component } from "react";
// import "./home_page.scss";

class ErrorMsgBD extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }

  render() {
    return (
      <div /*className="cp-ua-auth_main_container"*/>
        {/*<div className="cp-ua-auth_form">*/}
        <div>{this.props.mes}</div>
        {/*</div>*/}
      </div>
    );
  }
}

export default ErrorMsgBD;

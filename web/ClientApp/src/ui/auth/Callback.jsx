import React, { Component } from "react";
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc";
import { push } from "react-router-redux";

import userManager from "auth/userManager";

class Callback extends Component {
  render() {
    // just redirect to '/' in both cases
    return (
      <CallbackComponent
        userManager={userManager}
        successCallback={() => this.props.dispatch(push("/users"))}
        errorCallback={error => {
          this.props.dispatch(push("/"));
          console.error(error);
        }}
        >
        <div>Redirecting...</div>
      </CallbackComponent>
    );
  }
}

export default connect()(Callback);

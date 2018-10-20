import React, { Component } from 'react';
import userManager from "auth/userManager";
import Loader from 'ui/common/Loader'

class Login extends Component {

  componentDidMount() {
    userManager.signinRedirect();
  }

  render() {
    return <Loader text="signing in..." />
  }
}

export default Login
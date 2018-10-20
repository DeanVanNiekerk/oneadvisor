import React, { Component } from "react";
import { connect } from "react-redux";

import { processSilentRenew } from 'redux-oidc';

class SilentRefresh extends Component {

  componentDidMount() {
    processSilentRenew();
  }
 
  render() {
     return <div>renewing...</div>;
  }
}

export default connect()(SilentRefresh);

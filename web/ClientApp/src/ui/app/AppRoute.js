import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withRouter } from 'react-router'
import Layout from 'ui/layout/Layout';

class AppRoute extends Component {
    render() {
        return <Layout><Route {...this.props} /></Layout>;
    }
}

export default withRouter(AppRoute)
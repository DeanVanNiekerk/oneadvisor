import React, { Component } from 'react';
import { connect } from "react-redux";
import { Route, Redirect } from 'react-router-dom';
import { withRouter } from 'react-router'
import Layout from 'ui/layout/Layout';

class AppRoute extends Component {

    render() {

        const { user } = this.props;
        
        if(!user || user.expired )
            return <Redirect to="/login" />

        return <Layout><Route {...this.props} /></Layout>;

    }
    
}

const mapStateToProps = state => ({
    user: state.oidc.user,
})

export default withRouter(connect(mapStateToProps)(AppRoute));
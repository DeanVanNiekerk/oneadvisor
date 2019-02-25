import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router';
import { Redirect, Route } from 'react-router-dom';

import { isAuthenticatedSelector } from '@/state/auth';
import { RootState } from '@/state/rootReducer';

import Layout from './Layout';

type Props = {
    isAuthenticated: boolean;
} & RouteComponentProps &
    DispatchProp &
    RouteProps;

class SecureRoute extends Component<Props> {
    render() {
        if (!this.props.isAuthenticated) return <Redirect to="/signin" />;

        return (
            <Layout>
                <Route {...this.props} />
            </Layout>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: isAuthenticatedSelector(state)
});

export default withRouter(connect(mapStateToProps)(SecureRoute));

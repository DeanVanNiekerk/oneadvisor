// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { withAuth } from '@okta/okta-react';
import { connect } from 'react-redux';
import type { ReduxProps } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';

import Layout from '@/ui/layout/Layout';
import { Loader } from '@/ui/controls';

import { recieveAuthentication, clearAuthentication } from '@/state/auth/actions';

type LocalProps = {
    auth: Object,
    authenticated: boolean,
    children: any[]
};
type Props = LocalProps & ReduxProps;

class Authentication extends React.Component<Props> {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        this.checkAuthentication();
    }

    async componentDidUpdate() {
        this.checkAuthentication();
    }

    checkAuthentication = async () => {
        const authenticated = await this.props.auth.isAuthenticated();

        if (!authenticated) {
            this.props.auth.redirect();
            return;
        }

        if (this.props.authenticated === authenticated) return;

        if (authenticated) {
            const userinfo = await this.props.auth.getUser();
            const idToken = await this.props.auth.getIdToken();
            const accessToken = await this.props.auth.getAccessToken();
            this.props.dispatch(
                recieveAuthentication(userinfo, idToken, accessToken)
            );
        } else {
            this.props.dispatch(clearAuthentication());
        }
    };

    logout = () => {
        this.props.auth.logout();
    };

    render() {
        if (!this.props.authenticated)
            return <Loader text="signing in..." />

        return <Layout onLogout={this.logout}>{this.props.children}</Layout>;
    }
}

const mapStateToProps = (state: RootState) => ({
    authenticated: state.auth.authenticated,
    userInfo: state.auth.userInfo
});

export default connect(mapStateToProps)(withAuth(Authentication));

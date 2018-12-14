import React, { ReactNode } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { clearAuthentication, recieveAuthentication } from '@/state/auth/actions';
import { RootState } from '@/state/rootReducer';
import { Loader } from '@/ui/controls';
import Layout from '@/ui/layout/Layout';
import { withAuth } from '@okta/okta-react';

import Startup from './Startup';

type Props = {
    auth: any;
    authenticated: boolean;
    children: ReactNode;
} & DispatchProp;

class Authentication extends React.Component<Props> {
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
        if (!this.props.authenticated) return <Loader text="signing in..." />;

        return (
            <Startup>
                <Layout onLogout={this.logout}>{this.props.children}</Layout>
            </Startup>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    authenticated: state.auth.authenticated,
    userInfo: state.auth.userInfo
});

export default connect(mapStateToProps)(withAuth(Authentication));

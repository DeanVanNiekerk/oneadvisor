import { Modal } from 'antd';
import moment from 'moment';
import React, { ReactNode } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { IdTokenData, idTokenDataSelector } from '@/state/auth';
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
    idTokenData: IdTokenData;
} & DispatchProp;

type State = {
    redirecting: boolean;
};

class Authentication extends React.Component<Props, State> {
    private modal: any = null;

    constructor(props) {
        super(props);
        setInterval(this.checkTokenExpired, 10000); //Every 10 secs
    }

    async componentDidMount() {
        this.checkAuthentication();
    }

    checkTokenExpired = () => {
        const expiryDate = moment.unix(this.props.idTokenData.exp);
        const hasExpired = moment().isAfter(expiryDate);

        if (hasExpired && !this.modal) {
            this.modal = Modal.info({
                title: 'Session has Expired',
                content: (
                    <div>
                        <p>
                            Your session has expired, please click OK to sign in
                            again
                        </p>
                    </div>
                ),
                onOk: () => {
                    this.props.auth.redirect();
                }
            });
        }
    };

    checkAuthentication = async () => {
        const authenticated = await this.props.auth.isAuthenticated();

        if (!authenticated && this.modal === null) {
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
    userInfo: state.auth.userInfo,
    idTokenData: idTokenDataSelector(state)
});

export default connect(mapStateToProps)(withAuth(Authentication));

import React, { ReactNode } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { fetchAllLookups, lookupsSelector } from '@/state/app/directory/lookups';
import { fetchUsersSimple } from '@/state/app/directory/usersSimple';
import { isAuthenticatedSelector } from '@/state/auth';
import { fetchAppInfo } from '@/state/context/actions';
import { RootState } from '@/state/rootReducer';
import { Loader } from '@/ui/controls';

type Props = {
    isAuthenticated: boolean;
    loading: boolean;
    children: ReactNode;
} & DispatchProp &
    RouteComponentProps;

class Startup extends React.Component<Props> {
    componentDidMount() {
        this.props.dispatch(fetchAllLookups());
        this.props.dispatch(fetchAppInfo());
        this.loadSecureData();
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.isAuthenticated && !prevProps.isAuthenticated)
            this.loadSecureData();
    }

    loadSecureData() {
        if (this.props.isAuthenticated) {
            this.props.dispatch(fetchUsersSimple());
        }
    }

    isAccountPage = () => {
        return this.props.location.pathname === "/signin";
    };

    render() {
        if (this.props.loading && !this.isAccountPage())
            return <Loader text="loading application..." />;

        return <>{this.props.children}</>;
    }
}

const mapStateToProps = (state: RootState) => {
    const lookupsState = lookupsSelector(state);

    return {
        loading: lookupsState.fetching,
        isAuthenticated: isAuthenticatedSelector(state),
    };
};

export default withRouter(connect(mapStateToProps)(Startup));

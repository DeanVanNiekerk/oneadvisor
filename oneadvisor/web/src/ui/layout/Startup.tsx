import React, { ReactNode } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { clientLookupsSelector, fetchAllClientLookups } from '@/state/app/client/lookups';
import { commissionLookupsSelector, fetchAllCommissionLookups } from '@/state/app/commission/lookups';
import { directoryLookupsSelector, fetchAllDirectoryLookups } from '@/state/app/directory/lookups';
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
        this.props.dispatch(fetchAllDirectoryLookups());
        this.props.dispatch(fetchAllCommissionLookups());
        this.props.dispatch(fetchAllClientLookups());

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
    const directoryLookupsState = directoryLookupsSelector(state);
    const commissionLookupsState = commissionLookupsSelector(state);
    const clientLookupsState = clientLookupsSelector(state);

    return {
        loading:
            directoryLookupsState.fetching ||
            commissionLookupsState.fetching ||
            clientLookupsState.fetching,
        isAuthenticated: isAuthenticatedSelector(state),
    };
};

export default withRouter(connect(mapStateToProps)(Startup));

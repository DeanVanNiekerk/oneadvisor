import React, { ReactNode } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { fetchAllLookups, lookupsSelector } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';
import { Loader } from '@/ui/controls';

type Props = {
    //identity: Identity;
    loading: boolean;
    children: ReactNode;
} & DispatchProp;

class Startup extends React.Component<Props> {
    componentDidMount() {
        //if (this.props.identity === null) {
        //  this.props.dispatch(fetchIdentity());
        this.props.dispatch(fetchAllLookups());
        //            this.props.dispatch(fetchUsersSimple());
        //      }
    }

    render() {
        if (this.props.loading) return <Loader text="loading application..." />;

        return <>{this.props.children}</>;
    }
}

const mapStateToProps = (state: RootState) => {
    //const identityState = authSelector(state);
    const lookupsState = lookupsSelector(state);

    return {
        //identity: identityState.identity,
        loading: lookupsState.fetching
    };
};

export default connect(mapStateToProps)(Startup);

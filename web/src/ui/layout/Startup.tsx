import React, { ReactNode } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { fetchIdentity, Identity, identitySelector } from '@/state/app/directory/identity';
import { RootState } from '@/state/rootReducer';
import { Loader } from '@/ui/controls';

type Props = {
    identity: Identity;
    loading: boolean;
    children: ReactNode;
} & DispatchProp;

class Startup extends React.Component<Props> {
    componentDidMount() {
        if (this.props.identity === null) {
            this.props.dispatch(fetchIdentity());
        }
    }

    render() {
        if (this.props.loading || this.props.identity === null)
            return <Loader text="loading application..." />;

        return <>{this.props.children}</>;
    }
}

const mapStateToProps = (state: RootState) => {
    const identityState = identitySelector(state);

    return {
        identity: identityState.identity,
        loading: identityState.fetching
    };
};

export default connect(mapStateToProps)(Startup);

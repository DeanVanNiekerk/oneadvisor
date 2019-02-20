import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getPolicy, PolicyEdit } from '@/state/app/member/policies';

type Props = {
    policyId: string | null;
} & DispatchProp;

type State = {
    policy: PolicyEdit | null;
};

class PolicyNameComponent extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = { policy: null };
        this.loadMember();
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.policyId != prevProps.policyId) this.loadMember();
    }

    loadMember = () => {
        if (!this.props.policyId) {
            this.setState({ policy: null });
            return;
        }

        this.props.dispatch(
            getPolicy(this.props.policyId, (policy: PolicyEdit) => {
                this.setState({ policy: policy });
            })
        );
    };

    render() {
        const { policy } = this.state;

        if (!policy) return <span />;

        return <span>{`${policy.number || ''}`}</span>;
    }
}

const PolicyName = connect()(PolicyNameComponent);

export { PolicyName };

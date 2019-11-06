import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { getPolicy, PolicyEdit } from "@/state/app/client/policies";

type Props = {
    policyId: string | null;
    className?: string;
} & DispatchProp;

type State = {
    policy: PolicyEdit | null;
};

class PolicyNameComponent extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = { policy: null };
        this.loadClient();
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.policyId != prevProps.policyId) this.loadClient();
    }

    loadClient = () => {
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

        return <span className={this.props.className}>{`${policy.number || ""}`}</span>;
    }
}

const PolicyName = connect()(PolicyNameComponent);

export { PolicyName };

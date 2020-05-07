import React, { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";

import { getPolicy } from "@/state/client/policies";
import { PolicyEdit } from "@/state/client/policies/types";

type Props = {
    policyId: string | null;
    className?: string;
} & DispatchProp;

const PolicyNameComponent: React.FC<Props> = (props: Props) => {
    const [policy, setPolicy] = useState<PolicyEdit | null>(null);

    useEffect(() => {
        loadPolicy();
    }, [props.policyId]);

    const loadPolicy = () => {
        if (!props.policyId) {
            setPolicy(null);
            return;
        }

        props.dispatch(
            getPolicy(props.policyId, (policy: PolicyEdit) => {
                setPolicy(policy);
            })
        );
    };

    if (!policy) return <span />;

    return <span className={props.className}>{`${policy.number || ""}`}</span>;
};

const PolicyName = connect()(PolicyNameComponent);

export { PolicyName };

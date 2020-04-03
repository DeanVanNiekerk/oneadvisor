import React from "react";
import { connect } from "react-redux";

import { policySelector } from "@/state/client/policies";
import { RootState } from "@/state/rootReducer";

type Props = PropsFromState;

const EditPolicyTitle: React.FC<Props> = ({ policy }) => {
    return <>{policy && policy.id ? `Edit Policy` : "New Policy"}</>;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: RootState) => ({ policy: policySelector(state).policy });

export default connect(mapStateToProps)(EditPolicyTitle);

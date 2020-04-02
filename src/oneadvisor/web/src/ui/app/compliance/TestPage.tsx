import React from "react";
import { connect } from "react-redux";

import { complianceSelector } from "@/state/compliance/selectors";
import { RootState } from "@/state/rootReducer";

type Props = PropsFromState;

const TestPage: React.FC<Props> = (props) => {
    return <div>{props.fetching}</div>;
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const complianceState = complianceSelector(state);
    return {
        fetching: complianceState.fetching,
    };
};

export default connect(mapStateToProps)(TestPage);

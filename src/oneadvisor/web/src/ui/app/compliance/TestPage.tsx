import React from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { complianceSelector } from "@/state/compliance/selectors";

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

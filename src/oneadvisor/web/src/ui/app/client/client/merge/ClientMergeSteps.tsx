import React, { Component } from "react";
import { connect } from "react-redux";

import { RootState } from "@/state";
import { clientMergeSelector } from "@/state/client/clients";
import { StepProgress, StepProgressBaseProps } from "@/ui/controls";

class ClientMergeSteps extends Component<StepProgressBaseProps> {
    render() {
        return <StepProgress {...this.props} />;
    }
}

const mapStateToProps = (state: RootState) => {
    const mergeState = clientMergeSelector(state);

    return {
        steps: mergeState.steps,
        currentStepIndex: mergeState.currentStepIndex,
    };
};

export default connect(mapStateToProps)(ClientMergeSteps);

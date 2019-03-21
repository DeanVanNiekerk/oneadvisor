import React, { Component } from 'react';
import { connect } from 'react-redux';

import { memberMergeSelector } from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';
import { StepProgress, StepProgressProps } from '@/ui/controls';

class MemberMergeSteps extends Component<StepProgressProps> {
    render() {
        return <StepProgress {...this.props} />;
    }
}

const mapStateToProps = (state: RootState) => {
    const mergeState = memberMergeSelector(state);

    return {
        steps: mergeState.steps,
        currentStepIndex: mergeState.currentStepIndex,
    };
};

export default connect(mapStateToProps)(MemberMergeSteps);

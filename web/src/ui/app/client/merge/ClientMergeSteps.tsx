import React, { Component } from 'react';
import { connect } from 'react-redux';

import { clientMergeSelector } from '@/state/app/client/clients';
import { RootState } from '@/state/rootReducer';
import { StepProgress, StepProgressProps } from '@/ui/controls';

class ClientMergeSteps extends Component<StepProgressProps> {
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

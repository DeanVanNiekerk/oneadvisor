import { Steps } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { memberImportSelector } from '@/state/app/member/import';
import { RootState } from '@/state/rootReducer';
import { Header } from '@/ui/controls';

import Configure from './steps/Configure';
import Import from './steps/Import';
import Upload from './steps/Upload';
import Verify from './steps/Verify';

type Props = {
    currentStepIndex: number;
} & DispatchProp;

type State = {
    steps: React.ReactNode[];
};

class MemberImport extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            steps: [<Upload />, <Configure />, <Verify />, <Import />],
        };
    }

    render() {
        const { steps } = this.state;
        const { currentStepIndex } = this.props;

        return (
            <>
                <Header icon="upload">Import Member Data</Header>

                <div>{steps[currentStepIndex]}</div>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = memberImportSelector(state);

    return {
        currentStepIndex: importState.currentStepIndex,
    };
};

export default connect(mapStateToProps)(MemberImport);

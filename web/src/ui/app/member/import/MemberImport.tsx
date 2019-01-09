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

const Step = Steps.Step;

type Props = {
    currentStepIndex: number;
} & DispatchProp;

type StepInfo = {
    title: string;
    content: React.ReactNode;
};

type State = {
    steps: StepInfo[];
};

class MemberImport extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            steps: [
                {
                    title: 'Select File',
                    content: <Upload />
                },
                {
                    title: 'Configure',
                    content: <Configure />
                },
                {
                    title: 'Verify',
                    content: <Verify />
                },
                {
                    title: 'Import',
                    content: <Import />
                }
            ]
        };
    }

    render() {
        const { steps } = this.state;
        const { currentStepIndex } = this.props;

        return (
            <>
                <Header>Import Member Data</Header>

                <div className="mt-1" />

                <Steps current={currentStepIndex} size="small">
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>

                <div className="mt-2" />

                <div>{steps[currentStepIndex].content}</div>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = memberImportSelector(state);

    return {
        currentStepIndex: importState.currentStepIndex
    };
};

export default connect(mapStateToProps)(MemberImport);

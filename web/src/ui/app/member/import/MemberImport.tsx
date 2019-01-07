import { Col, Row, Steps } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { ImportData, memberImportSelector } from '@/state/app/member/import';
import { RootState } from '@/state/rootReducer';
import { Button, Header } from '@/ui/controls';

import Configure from './steps/Configure';
import Upload from './steps/Upload';

const Step = Steps.Step;

type Props = {
    data: ImportData;
} & DispatchProp;

type StepInfo = {
    title: string;
    content: React.ReactNode;
};

type State = {
    current: number;
    steps: StepInfo[];
};

class MemberImport extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            current: 0,
            steps: [
                {
                    title: 'Upload',
                    content: <Upload onComplete={this.next} />
                },
                {
                    title: 'Configure',
                    content: <Configure />
                },
                {
                    title: 'Verify',
                    content: 'TODO'
                },
                {
                    title: 'Import',
                    content: 'TODO'
                }
            ]
        };
    }

    next = () => {
        const current = this.state.current + 1;
        this.setState({ current });
    };

    previous = () => {
        const current = this.state.current - 1;
        this.setState({ current });
    };

    nextVisible = () => {
        return this.state.current < this.state.steps.length - 1;
    };

    nextEnabled = () => {
        switch (this.state.current) {
            case 0:
                return this.props.data.length > 0;
            default:
                return true;
        }
    };

    previousVisible = () => {
        return this.state.current > 0;
    };

    finishVisible = () => {
        return this.state.current === this.state.steps.length - 1;
    };

    render() {
        const { current, steps } = this.state;

        return (
            <>
                <Header>Import Member Data</Header>

                <div className="mt-1" />

                <Steps current={current} size="small">
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>

                <div className="mt-2" />

                <div>{steps[current].content}</div>

                <Row type="flex" justify="end" className="mt-1">
                    <Col>
                        {this.previousVisible() && (
                            <Button onClick={() => this.previous()}>
                                Previous
                            </Button>
                        )}
                        {this.nextVisible() && (
                            <Button
                                type="primary"
                                disabled={!this.nextEnabled()}
                                onClick={() => this.next()}
                            >
                                Next
                            </Button>
                        )}
                        {this.finishVisible() && (
                            <Button type="primary" onClick={() => {}}>
                                Finish
                            </Button>
                        )}
                    </Col>
                </Row>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = memberImportSelector(state);

    return {
        data: importState.data
    };
};

export default connect(mapStateToProps)(MemberImport);

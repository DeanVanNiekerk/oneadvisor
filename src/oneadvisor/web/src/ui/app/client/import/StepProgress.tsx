import { Col, Icon, Row, Steps } from "antd";
import React, { Component } from "react";
import { connect } from "react-redux";

import { clientImportSelector } from "@/state/app/client/import";
import { RootState } from "@/state/rootReducer";
import { Button } from "@/ui/controls";

const Step = Steps.Step;

type Props = {
    currentStepIndex: number;
    steps: string[];
    onPrevious?: () => void;
    previousDisabled?: boolean;
    onNext: () => void;
    nextDisabled?: boolean;
    nextLoading?: boolean;
    nextText?: string;
    nextIcon?: string;
};

class StepProgress extends Component<Props> {
    render() {
        return (
            <Row type="flex" align="middle" gutter={16} className="mb-1">
                <Col>
                    {this.props.onPrevious && (
                        <Button
                            noLeftMargin={true}
                            onClick={this.props.onPrevious}
                            disabled={this.props.previousDisabled}
                        >
                            <Icon type="left" />
                            Previous
                        </Button>
                    )}
                </Col>
                <Col style={{ flex: 1 }}>
                    <Steps current={this.props.currentStepIndex} size="small">
                        {this.props.steps.map(item => (
                            <Step key={item} title={item} />
                        ))}
                    </Steps>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        onClick={this.props.onNext}
                        disabled={this.props.nextDisabled}
                        loading={this.props.nextLoading}
                    >
                        {this.props.nextText ? this.props.nextText : "Next"}
                        <Icon type={this.props.nextIcon ? this.props.nextIcon : "right"} />
                    </Button>
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const importState = clientImportSelector(state);

    return {
        steps: importState.steps,
        currentStepIndex: importState.currentStepIndex,
    };
};

export default connect(mapStateToProps)(StepProgress);
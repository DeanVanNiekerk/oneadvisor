import { Col, Icon, Row, Steps } from "antd";
import React from "react";

import { Button } from "@/ui/controls";

const Step = Steps.Step;

export type StepProgressProps = {
    currentStepIndex: number;
    steps: string[];
    onPrevious?: () => void;
    previousDisabled?: boolean;
    onNext?: () => void;
    nextDisabled?: boolean;
    nextLoading?: boolean;
    nextText?: string;
    nextIcon?: string;
};

const StepProgress: React.FC<StepProgressProps> = (props: StepProgressProps) => {
    return (
        <Row type="flex" align="middle" gutter={16} className="mb-1">
            <Col>
                {props.onPrevious && (
                    <Button
                        noLeftMargin={true}
                        onClick={props.onPrevious}
                        disabled={props.previousDisabled}
                    >
                        <Icon type="left" />
                        Previous
                    </Button>
                )}
            </Col>
            <Col style={{ flex: 1 }}>
                <Steps current={props.currentStepIndex} size="small">
                    {props.steps.map(item => (
                        <Step key={item} title={item} />
                    ))}
                </Steps>
            </Col>
            <Col>
                {props.onNext && (
                    <Button
                        type="primary"
                        onClick={props.onNext}
                        disabled={props.nextDisabled}
                        loading={props.nextLoading}
                    >
                        {props.nextText ? props.nextText : "Next"}
                        <Icon type={props.nextIcon ? props.nextIcon : "right"} />
                    </Button>
                )}
            </Col>
        </Row>
    );
};

export { StepProgress };

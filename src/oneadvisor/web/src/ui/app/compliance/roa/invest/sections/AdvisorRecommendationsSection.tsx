import { Card, Col, Row } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import {
    receiveAdvisorRecommendation,
    receiveInvestmentLumpsum,
    receiveInvestmentRecurringPremium,
    receiveRetirementPolicyRecurringPremium,
    roaInvestInputsSelector,
} from "@/state/compliance/roa";
import { Form, FormInputNumber, FormTextArea } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const AdvisorRecommendationsSection: React.FC<Props> = (props) => {
    return (
        <Card title="Advisor Recommendation">
            <Row gutter={24}>
                <Col md={24} xl={6}>
                    <Form layout="vertical" size="small">
                        <FormInputNumber
                            fieldName="retirementPolicyRecurringPremium"
                            label="Retirement Policy Recurring Premium"
                            value={props.retirementPolicyRecurringPremium}
                            onChange={(_fieldName, value) =>
                                props.receiveRetirementPolicyRecurringPremium(
                                    value === undefined ? null : value
                                )
                            }
                            precision={0}
                        />
                        <FormInputNumber
                            fieldName="investmentRecurringPremium"
                            label="Investment Recurring Premium"
                            value={props.investmentRecurringPremium}
                            onChange={(_fieldName, value) =>
                                props.receiveInvestmentRecurringPremium(
                                    value === undefined ? null : value
                                )
                            }
                            precision={0}
                        />
                        <FormInputNumber
                            fieldName="investmentLumpsum"
                            label="Investment Lumpsum"
                            value={props.investmentLumpsum}
                            onChange={(_fieldName, value) =>
                                props.receiveInvestmentLumpsum(value === undefined ? null : value)
                            }
                            precision={0}
                        />
                    </Form>
                </Col>
                <Col md={24} xl={18}>
                    <Form layout="vertical" size="small">
                        <FormTextArea
                            fieldName="advisorRecommendation"
                            label="Recommendation"
                            value={props.advisorRecommendation}
                            rows={10}
                            onChange={(_fieldName, value) =>
                                props.receiveAdvisorRecommendation(value)
                            }
                        />
                    </Form>
                </Col>
            </Row>
        </Card>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const roaInvestState = roaInvestInputsSelector(state);
    return {
        advisorRecommendation: roaInvestState.advisorRecommendation,
        investmentLumpsum: roaInvestState.investmentLumpsum,
        investmentRecurringPremium: roaInvestState.investmentRecurringPremium,
        retirementPolicyRecurringPremium: roaInvestState.retirementPolicyRecurringPremium,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators(
            {
                receiveAdvisorRecommendation,
                receiveInvestmentLumpsum,
                receiveInvestmentRecurringPremium,
                receiveRetirementPolicyRecurringPremium,
            },
            dispatch
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdvisorRecommendationsSection);

import { Card, Col, Row } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import {
    receiveRecommendedAction,
    receiveRecommendedCompanyIds,
    receiveRecommendedFunds,
    receiveRecommendedProductTypeIds,
    roaInvestInputsSelector,
} from "@/state/compliance/roa";
import { POLICY_TYPE_ID_INVESTMENT, policyProductTypesSelector } from "@/state/lookups/client";
import {
    organisationCompaniesSelector,
    organisationFundsSelector,
} from "@/state/lookups/directory";
import { Form, FormSelect, FormTextArea } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const AdvisorRecommendationsSection: React.FC<Props> = (props) => {
    return (
        <Card title="Advisor Recommendations" style={{ paddingBottom: 12 }}>
            <Row gutter={24}>
                <Col md={24} xl={12}>
                    <Form layout="vertical" size="small">
                        <FormTextArea
                            fieldName="recommendedAction"
                            label="Recommendation"
                            value={props.recommendedAction}
                            rows={5}
                            onChange={(_fieldName, value) => props.receiveRecommendedAction(value)}
                        />
                    </Form>
                </Col>

                <Col md={24} xl={12}>
                    <Form size="small">
                        <FormSelect<string[]>
                            mode="multiple"
                            fieldName="productTypeIds"
                            label="Products"
                            options={props.productTypes}
                            optionsValue="id"
                            optionsText="name"
                            value={props.productTypeIds}
                            onChange={(_fieldName, values) =>
                                props.receiveRecommendedProductTypeIds(values)
                            }
                        />

                        <FormSelect<string[]>
                            mode="multiple"
                            fieldName="funds"
                            label="Funds"
                            options={props.organisationFunds.map((f) => ({ id: f, name: f }))}
                            optionsValue="id"
                            optionsText="name"
                            value={props.funds}
                            onChange={(_fieldName, values) => props.receiveRecommendedFunds(values)}
                        />

                        <FormSelect<string[]>
                            mode="multiple"
                            fieldName="companyIds"
                            label="Companies"
                            options={props.companies}
                            optionsValue="id"
                            optionsText="name"
                            value={props.companyIds}
                            onChange={(_fieldName, values) =>
                                props.receiveRecommendedCompanyIds(values)
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
        productTypeIds: roaInvestState.recommendedProductTypeIds,
        productTypes: policyProductTypesSelector(state).items.filter(
            (t) => t.policyTypeId === POLICY_TYPE_ID_INVESTMENT
        ),
        companyIds: roaInvestState.recommendedCompanyIds,
        companies: organisationCompaniesSelector(state),
        organisationFunds: organisationFundsSelector(state),
        funds: roaInvestState.recommendedFunds,
        recommendedAction: roaInvestState.recommendedAction,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators(
            {
                receiveRecommendedProductTypeIds,
                receiveRecommendedCompanyIds,
                receiveRecommendedFunds,
                receiveRecommendedAction,
            },
            dispatch
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AdvisorRecommendationsSection);

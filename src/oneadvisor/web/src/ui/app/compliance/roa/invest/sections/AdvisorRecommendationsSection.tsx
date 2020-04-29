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
    roaInvestInputsRecommendedSelector,
    roaInvestRecommendedCompaniesSelector,
    roaInvestRecommendedFundsSelector,
    roaInvestRecommendedProductTypesSelector,
} from "@/state/compliance/roa";
import { Form, FormSelect, FormTextArea } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const AdvisorRecommendationsSection: React.FC<Props> = (props) => {
    return (
        <Card title="Advisor Recommendations">
            <Row gutter={24}>
                <Col md={24} xl={12}>
                    <Form layout="vertical">
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
                    <Form>
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
    const roaInvestState = roaInvestInputsRecommendedSelector(state);
    return {
        productTypeIds: roaInvestState.recommendedProductTypeIds,
        productTypes: roaInvestRecommendedProductTypesSelector(state),
        companyIds: roaInvestState.recommendedCompanyIds,
        companies: roaInvestRecommendedCompaniesSelector(state),
        organisationFunds: roaInvestRecommendedFundsSelector(state),
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

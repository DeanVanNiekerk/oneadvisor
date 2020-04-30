import { Card, Col, Row } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import {
    roaInvestInputsDiscussedSelector,
    updateDiscussedCompanyIds,
    updateDiscussedFunds,
    updateDiscussedProductTypeIds,
} from "@/state/compliance/roa";
import { policyProductTypesInvestmentSelector } from "@/state/lookups/client";
import {
    organisationCompaniesSelector,
    organisationFundsSelector,
} from "@/state/lookups/directory";
import { Form, FormSelect } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const OptionsDiscussedSection: React.FC<Props> = (props) => {
    return (
        <Card title="Options Discussed">
            <Row gutter={24}>
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
                                props.updateDiscussedProductTypeIds(values)
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
                            onChange={(_fieldName, values) => props.updateDiscussedFunds(values)}
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
                                props.updateDiscussedCompanyIds(values)
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
    const roaInvestState = roaInvestInputsDiscussedSelector(state);
    return {
        productTypeIds: roaInvestState.discussedProductTypeIds,
        productTypes: policyProductTypesInvestmentSelector(state),
        companyIds: roaInvestState.discussedCompanyIds,
        companies: organisationCompaniesSelector(state),
        organisationFunds: organisationFundsSelector(state),
        funds: roaInvestState.discussedFunds,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators(
            { updateDiscussedProductTypeIds, updateDiscussedCompanyIds, updateDiscussedFunds },
            dispatch
        ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionsDiscussedSection);

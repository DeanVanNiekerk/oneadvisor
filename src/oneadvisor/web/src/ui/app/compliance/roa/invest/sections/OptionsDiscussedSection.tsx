import { Card } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import {
    receiveCompanyIds,
    receiveFunds,
    receiveProductTypeIds,
    roaInvestInputsSelector,
} from "@/state/compliance/roa";
import { POLICY_TYPE_ID_INVESTMENT, policyProductTypesSelector } from "@/state/lookups/client";
import {
    organisationCompaniesSelector,
    organisationFundsSelector,
} from "@/state/lookups/directory";
import { Form, FormSelect } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const OptionsDiscussedSection: React.FC<Props> = (props) => {
    return (
        <Card title="Options Discussed" style={{ paddingBottom: 12 }}>
            <Form layout="vertical" size="small">
                <FormSelect<string[]>
                    mode="multiple"
                    fieldName="productTypeIds"
                    label="Product Types"
                    options={props.productTypes}
                    optionsValue="id"
                    optionsText="name"
                    value={props.productTypeIds}
                    onChange={(_fieldName, values) => props.receiveProductTypeIds(values)}
                />

                <FormSelect<string[]>
                    mode="multiple"
                    fieldName="funds"
                    label="Funds"
                    options={props.organisationFunds.map((f) => ({ id: f, name: f }))}
                    optionsValue="id"
                    optionsText="name"
                    value={props.funds}
                    onChange={(_fieldName, values) => props.receiveFunds(values)}
                />

                <FormSelect<string[]>
                    mode="multiple"
                    fieldName="companyIds"
                    label="Companies"
                    options={props.companies}
                    optionsValue="id"
                    optionsText="name"
                    value={props.companyIds}
                    onChange={(_fieldName, values) => props.receiveCompanyIds(values)}
                />
            </Form>
        </Card>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const roaInvestState = roaInvestInputsSelector(state);
    return {
        productTypeIds: roaInvestState.productTypeIds,
        productTypes: policyProductTypesSelector(state).items.filter(
            (t) => t.policyTypeId === POLICY_TYPE_ID_INVESTMENT
        ),
        companyIds: roaInvestState.companyIds,
        companies: organisationCompaniesSelector(state),
        organisationFunds: organisationFundsSelector(state),
        funds: roaInvestState.funds,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ receiveProductTypeIds, receiveCompanyIds, receiveFunds }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionsDiscussedSection);

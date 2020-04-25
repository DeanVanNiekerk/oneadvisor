import { Card } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "@/state";
import {
    receiveCompanyIds,
    receiveProductTypeIds,
    roaInvestInputsSelector,
} from "@/state/compliance/roa";
import { POLICY_TYPE_ID_INVESTMENT, policyProductTypesSelector } from "@/state/lookups/client";
import { organisationCompaniesSelector } from "@/state/lookups/directory";
import { Form, FormSelect } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const OptionsDiscussedSection: React.FC<Props> = (props) => {
    return (
        <Card title="Options Discussed">
            <Form layout="vertical">
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
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        ...bindActionCreators({ receiveProductTypeIds, receiveCompanyIds }, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OptionsDiscussedSection);

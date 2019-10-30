import { CascaderOptionType } from "antd/lib/cascader";
import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { filterOption } from "@/app/controls/select";
import {
    policyProductCascade, policyProductsSelector, policyProductTypesSelector, policyTypesSelector
} from "@/state/app/client/lookups";
import { modifyPolicy, PolicyEdit, policySelector } from "@/state/app/client/policies";
import { organisationCompaniesSelector } from "@/state/app/directory/lookups";
import { brokersSelector } from "@/state/app/directory/usersSimple";
import { RootState } from "@/state/rootReducer";
import { Form, FormCascade, FormDate, FormInput, FormInputNumber, FormSelect, FormSwitch } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const PolicyForm: React.FC<Props> = (props: Props) => {

    const { policy, handleChange, validationResults } = props;

    if (!policy) return <React.Fragment />;

    const onChange = (fieldName: keyof PolicyEdit, value: string | boolean) => {
        handleChange(policy, fieldName, value);
    };

    return (
        <Form editUseCase="clt_edit_policies">
            <FormSelect
                fieldName="companyId"
                label="Company"
                value={policy.companyId}
                onChange={onChange}
                validationResults={validationResults}
                options={props.companies}
                optionsValue="id"
                optionsText="name"
                filterOption={filterOption}
            />
            <FormCascade
                fieldName="policyTypeId"
                label="Type / Product / Name"
                value={props.getPolicyProductCascaseValues()}
                onChange={(values: string[]) => props.handlePolicyProductCascaseChange(policy, values)}
                validationResults={validationResults}
                options={props.getPolicyProductCascase()}
                changeOnSelect={true}
            />
            <FormSelect
                fieldName="userId"
                label="Broker"
                value={policy.userId}
                onChange={onChange}
                validationResults={validationResults}
                options={props.users}
                optionsValue="id"
                optionsText="fullName"
                filterOption={filterOption}
            />
            <FormInput
                fieldName="number"
                label="Number"
                value={policy.number}
                onChange={onChange}
                validationResults={validationResults}
            />
            <FormInputNumber
                fieldName="premium"
                label="Premium"
                value={policy.premium}
                onChange={onChange}
                validationResults={validationResults}
                min={0}
            />
            <FormDate
                fieldName="startDate"
                label="Start Date"
                value={policy.startDate}
                onChange={onChange}
                validationResults={validationResults}
            />
            <FormSwitch
                fieldName="isActive"
                label="Active"
                value={policy.isActive}
                onChange={onChange}
                validationResults={validationResults}
            />
        </Form>
    );
}

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const policyState = policySelector(state);
    return {
        policy: policyState.policy,
        validationResults: policyState.validationResults,
        companies: organisationCompaniesSelector(state),
        users: brokersSelector(state),
        getPolicyProductCascase: (): CascaderOptionType[] => {
            return policyProductCascade(
                policyTypesSelector(state).items,
                policyProductTypesSelector(state).items,
                policyProductsSelector(state).items,
                policyState.policy ? policyState.policy.companyId : ""
            );
        },
        getPolicyProductCascaseValues: (): string[] => {

            const values: string[] = [];
            const policy = policyState.policy;

            if (!policy) return values;

            if (policy.policyTypeId) {
                values.push(policy.policyTypeId);

                if (policy.policyProductTypeId) {
                    values.push(policy.policyProductTypeId);

                    if (policy.policyProductId) {
                        values.push(policy.policyProductId);
                    }
                }
            }

            return values;
        },
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        handleChange: (policy: PolicyEdit, fieldName: keyof PolicyEdit, value: string | boolean) => {
            let policyModified = update(policy, { [fieldName]: { $set: value } });

            //If the company changes we need to clear the PolicyProduct
            if (fieldName === "companyId") policy.policyProductId = null;

            dispatch(modifyPolicy(policyModified));
        },
        handlePolicyProductCascaseChange: (policy: PolicyEdit, values: string[]) => {
            const policyModified: PolicyEdit = {
                ...policy,
                policyTypeId: null,
                policyProductTypeId: null,
                policyProductId: null,
            };

            if (values.length >= 1) policyModified.policyTypeId = values[0];

            if (values.length >= 2) policyModified.policyProductTypeId = values[1];

            if (values.length === 3) policyModified.policyProductId = values[2];

            dispatch(modifyPolicy(policyModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolicyForm);

import { CascaderOptionType } from 'antd/lib/cascader';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import {
    PolicyProduct, policyProductCascade, policyProductsSelector, PolicyProductType, policyProductTypesSelector,
    PolicyType, policyTypesSelector
} from '@/state/app/client/lookups';
import { PolicyEdit } from '@/state/app/client/policies';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { UserSimple, usersSimpleSelector } from '@/state/app/directory/usersSimple';
import { RootState } from '@/state/rootReducer';
import { Form, FormCascade, FormDate, FormInput, FormInputNumber, FormSelect } from '@/ui/controls';

type Props = {
    policy: PolicyEdit;
    validationResults: ValidationResult[];
    onChange: (policy: PolicyEdit) => void;
    users: UserSimple[];
    companies: Company[];
    policyTypes: PolicyType[];
    policyProductTypes: PolicyProductType[];
    policyProducts: PolicyProduct[];
};

type State = {
    policy: PolicyEdit;
};

class PolicyForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            policy: props.policy,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.policy != prevProps.policy)
            this.setState({
                policy: this.props.policy,
            });
    }

    handleChange = (
        fieldName: keyof PolicyEdit,
        value: string | number | null
    ) => {
        const policy = {
            ...this.state.policy,
            [fieldName]: value,
        };

        //If the company changes we need to clear the PolicyProduct
        if (fieldName === "companyId") policy.policyProductId = null;

        this.updateState(policy);
    };

    updateState = (policy: PolicyEdit) => {
        this.setState({
            policy: policy,
        });
        this.props.onChange(policy);
    };

    getPolicyProductCascase = (): CascaderOptionType[] => {
        return policyProductCascade(
            this.props.policyTypes,
            this.props.policyProductTypes,
            this.props.policyProducts,
            this.state.policy.companyId
        );
    };

    getPolicyProductCascaseValues = (): string[] => {
        const { policy } = this.state;

        const values: string[] = [];

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
    };

    handlePolicyProductCascaseChange = (values: string[]) => {
        const policy: PolicyEdit = {
            ...this.state.policy,
            policyTypeId: null,
            policyProductTypeId: null,
            policyProductId: null,
        };

        if (values.length >= 1) policy.policyTypeId = values[0];

        if (values.length >= 2) policy.policyProductTypeId = values[1];

        if (values.length === 3) policy.policyProductId = values[2];

        this.updateState(policy);
    };

    render() {
        const { validationResults } = this.props;
        const { policy } = this.state;

        return (
            <Form editUseCase="clt_edit_policies">
                <FormSelect
                    fieldName="companyId"
                    label="Company"
                    value={policy.companyId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.companies}
                    optionsValue="id"
                    optionsText="name"
                />
                <FormCascade
                    fieldName="policyTypeId"
                    label="Type / Product / Name"
                    value={this.getPolicyProductCascaseValues()}
                    onChange={this.handlePolicyProductCascaseChange}
                    validationResults={validationResults}
                    options={this.getPolicyProductCascase()}
                    changeOnSelect={true}
                />
                <FormSelect
                    defaultActiveFirstOption={true}
                    fieldName="userId"
                    label="Broker"
                    value={policy.userId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.users}
                    optionsValue="id"
                    optionsText="fullName"
                />
                <FormInput
                    fieldName="number"
                    label="Number"
                    value={policy.number}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInputNumber
                    fieldName="premium"
                    label="Premium"
                    value={policy.premium}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    isCurrency={true}
                    min={0}
                />
                <FormDate
                    fieldName="startDate"
                    label="Start Date"
                    value={policy.startDate}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const usersState = usersSimpleSelector(state);
    const companiesState = companiesSelector(state);
    const policyTypeState = policyTypesSelector(state);
    const policyProductTypeState = policyProductTypesSelector(state);
    const policyProductState = policyProductsSelector(state);

    return {
        users: usersState.items,
        companies: companiesState.items,
        policyTypes: policyTypeState.items,
        policyProductTypes: policyProductTypeState.items,
        policyProducts: policyProductState.items,
    };
};

export default connect(mapStateToProps)(PolicyForm);

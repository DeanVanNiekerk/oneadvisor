import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { applyLikeFormat } from '@/app/query';
import { Filters } from '@/app/table';
import { ValidationResult } from '@/app/validation';
import { CommissionEdit } from '@/state/app/commission/commissions';
import { CommissionType, commissionTypesSelector } from '@/state/app/directory/lookups';
import { getPolicies, Policy } from '@/state/app/member/policies';
import { RootState } from '@/state/rootReducer';
import { Form, FormDate, FormInput, FormInputNumber, FormSelect } from '@/ui/controls';

type Props = {
    commission: CommissionEdit;
    validationResults: ValidationResult[];
    onChange: (member: CommissionEdit) => void;
    commissionTypes: CommissionType[];
} & DispatchProp;

type State = {
    commission: CommissionEdit;
    policies: Policy[];
};

class CommissionForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            commission: props.commission,
            policies: []
        };

        this.loadPolicy(this.props.commission.policyId);
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.commission != prevProps.commission) {
            this.setState({
                commission: this.props.commission
            });
            this.loadPolicy(this.props.commission.policyId);
        }
    }

    handleChange = async (fieldName: string, value: any) => {
        const commission = {
            ...this.state.commission,
            [fieldName]: value
        };
        this.setState({
            commission: commission
        });
        this.props.onChange(commission);
    };

    loadPolicy = (policyId: string) => {
        if (!policyId) return;

        const filters = {
            id: [policyId]
        };
        this.loadPolicies(filters);
    };

    loadPolicies = (filters: Filters) => {
        const pageOptions = {
            number: 1,
            size: 20 //Limit to 20 records
        };
        this.props.dispatch(
            getPolicies(filters, pageOptions, policies => {
                this.setState({
                    policies: policies
                });
            })
        );
    };

    policySearch = (value: string) => {
        if (value.length < 3) {
            this.handleChange('policyId', '');
            this.setState({
                policies: []
            });
            return;
        }
        const filters = { number: [applyLikeFormat(value)] };
        this.loadPolicies(filters);
    };

    render() {
        const { validationResults } = this.props;
        const { commission } = this.state;

        return (
            <Form editUseCase="com_edit_commissions">
                <FormSelect
                    showSearch={true}
                    showArrow={false}
                    filterOption={false}
                    defaultActiveFirstOption={false}
                    placeholder={'Select Policy'}
                    notFoundContent={null}
                    fieldName="policyId"
                    onSearch={this.policySearch}
                    label="Policy"
                    value={commission.policyId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.state.policies}
                    optionsValue="id"
                    optionsText="number"
                    autoFocus={true}
                />
                <FormSelect
                    fieldName="commissionTypeId"
                    label="Type"
                    value={commission.commissionTypeId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.commissionTypes}
                    optionsValue="id"
                    optionsText="name"
                />
                <FormInputNumber
                    fieldName="amountIncludingVAT"
                    label="Amount (incl VAT)"
                    value={commission.amountIncludingVAT}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    isCurrency={true}
                    min={0}
                />
                <FormInputNumber
                    fieldName="vat"
                    label="VAT"
                    value={commission.vat}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    isCurrency={true}
                    min={0}
                />
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const commissionTypeState = commissionTypesSelector(state);

    return {
        commissionTypes: commissionTypeState.items
    };
};

export default connect(mapStateToProps)(CommissionForm);

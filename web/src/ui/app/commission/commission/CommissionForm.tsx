import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import { CommissionEdit } from '@/state/app/commission/commissions';
import { CommissionType, commissionTypesSelector, companiesSelector } from '@/state/app/directory/lookups';
import { RootState } from '@/state/rootReducer';
import { Form, FormInput, FormInputNumber, FormSelect } from '@/ui/controls';

type Props = {
    commission: CommissionEdit;
    validationResults: ValidationResult[];
    onChange: (member: CommissionEdit) => void;
    commissionTypes: CommissionType[];
};

type State = {
    commission: CommissionEdit;
};

class CommissionForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            commission: props.commission
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.commission != prevProps.commission)
            this.setState({
                commission: this.props.commission
            });
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

    render() {
        const { validationResults } = this.props;
        const { commission } = this.state;

        //8d8de9d4-1553-4732-d5ab-08d687963fe8

        return (
            <Form editUseCase="com_edit_commissions">
                <FormInput
                    fieldName="policyId"
                    label="Policy Id"
                    value={commission.policyId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
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

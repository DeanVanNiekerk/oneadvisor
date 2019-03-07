import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import {
    CommissionEarningsType, commissionEarningsTypesSelector, PolicyType, policyTypesSelector
} from '@/state/app/directory/lookups';
import { CommissionType } from '@/state/app/directory/lookups/commissionTypes';
import { RootState } from '@/state/rootReducer';
import { Form, FormInput, FormSelect } from '@/ui/controls';

type Props = {
    commissionType: CommissionType;
    validationResults: ValidationResult[];
    onChange: (commissionType: CommissionType) => void;
    policyTypes: PolicyType[];
    commissionEarningsTypes: CommissionEarningsType[];
};

type State = {
    commissionType: CommissionType;
};

class CommissionTypeForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            commissionType: props.commissionType,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.commissionType != prevProps.commissionType)
            this.setState({
                commissionType: this.props.commissionType,
            });
    }

    handleChange = (fieldName: string, value: any) => {
        const commissionType = {
            ...this.state.commissionType,
            [fieldName]: value,
        };
        this.setState({
            commissionType: commissionType,
        });
        this.props.onChange(commissionType);
    };

    render() {
        const { validationResults } = this.props;
        const { commissionType } = this.state;

        return (
            <Form editUseCase="dir_edit_lookups">
                <FormInput
                    fieldName="name"
                    label="Name"
                    value={commissionType.name}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                />
                <FormInput
                    fieldName="code"
                    label="Code"
                    value={commissionType.code}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    disabled={true}
                />
                <FormSelect
                    fieldName="policyTypeId"
                    label="Policy Type"
                    value={commissionType.policyTypeId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.policyTypes}
                    optionsValue="id"
                    optionsText="name"
                />
                <FormSelect
                    fieldName="commissionEarningsTypeId"
                    label="Earnings Type"
                    value={commissionType.commissionEarningsTypeId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.commissionEarningsTypes}
                    optionsValue="id"
                    optionsText="name"
                />
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const policyTypeState = policyTypesSelector(state);
    const commissionEarningsTypeState = commissionEarningsTypesSelector(state);

    return {
        policyTypes: policyTypeState.items,
        commissionEarningsTypes: commissionEarningsTypeState.items,
    };
};

export default connect(mapStateToProps)(CommissionTypeForm);

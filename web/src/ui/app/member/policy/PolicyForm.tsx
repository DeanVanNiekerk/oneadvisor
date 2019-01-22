import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import { companiesSelector, Company } from '@/state/app/directory/lookups';
import { UserSimple, usersSimpleSelector } from '@/state/app/directory/usersSimple';
import { PolicyEdit } from '@/state/app/member/policies';
import { RootState } from '@/state/rootReducer';
import { Form, FormDate, FormInput, FormInputNumber, FormSelect } from '@/ui/controls';

type Props = {
    policy: PolicyEdit;
    validationResults: ValidationResult[];
    onChange: (member: PolicyEdit) => void;
    users: UserSimple[];
    companies: Company[];
};

type State = {
    policy: PolicyEdit;
};

class PolicyForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            policy: props.policy
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.policy != prevProps.policy)
            this.setState({
                policy: this.props.policy
            });
    }

    handleChange = async (fieldName: string, value: any) => {
        const policy = {
            ...this.state.policy,
            [fieldName]: value
        };
        this.setState({
            policy: policy
        });
        this.props.onChange(policy);
    };

    render() {
        const { validationResults } = this.props;
        const { policy } = this.state;

        return (
            <Form editUseCase="mem_edit_policies">
                <FormInput
                    fieldName="number"
                    label="Number"
                    value={policy.number}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                />
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

    return {
        users: usersState.items,
        companies: companiesState.items
    };
};

export default connect(mapStateToProps)(PolicyForm);

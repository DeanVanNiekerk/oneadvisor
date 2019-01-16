import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';
import { PolicyEdit } from '@/state/app/member/policies';
import { Form, FormInput } from '@/ui/controls';

type Props = {
    policy: PolicyEdit;
    validationResults: ValidationResult[];
    onChange: (member: PolicyEdit) => void;
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
            <Form>
                <FormInput
                    fieldName="number"
                    label="Number"
                    value={policy.number}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    focus={true}
                />
                <FormInput
                    fieldName="companyId"
                    label="CompanyId"
                    value={policy.companyId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="userId"
                    label="UserId"
                    value={policy.userId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
            </Form>
        );
    }
}

export default PolicyForm;

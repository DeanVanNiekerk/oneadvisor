import React, { Component } from 'react';

import { ValidationResult } from '@/app/types';
import { MemberEdit } from '@/state/app/member/members';
import { Form, FormDate, FormInput } from '@/ui/controls';

type TabKey = 'details_tab' | 'roles_tab';

type Props = {
    member: MemberEdit;
    validationResults: ValidationResult[];
    onChange: (member: MemberEdit) => void;
};

type State = {
    member: MemberEdit;
};

class MemberForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            member: props.member
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.member != prevProps.member)
            this.setState({
                member: this.props.member
            });
    }

    handleChange = (fieldName: string, value: any) => {
        const member = {
            ...this.state.member,
            [fieldName]: value
        };
        this.setState({
            member: member
        });
        this.props.onChange(member);
    };

    render() {
        const { validationResults } = this.props;
        const { member } = this.state;

        return (
            <Form>
                <FormInput
                    fieldName="firstName"
                    label="First Name"
                    value={member.firstName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="lastName"
                    label="Last Name"
                    value={member.lastName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="initials"
                    label="Initials"
                    value={member.initials}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="maidenName"
                    label="Maiden Name"
                    value={member.maidenName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="preferredName"
                    label="Preferred Name"
                    value={member.preferredName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="idNumber"
                    label="ID Number"
                    value={member.idNumber}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormDate
                    fieldName="dateOfBirth"
                    label="Date of Birth"
                    value={member.dateOfBirth}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
            </Form>
        );
    }
}

export default MemberForm;

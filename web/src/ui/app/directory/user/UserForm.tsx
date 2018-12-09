import React, { Component } from 'react';

import { ValidationResult } from '@/state/types';
import { User } from '@/state/app/directory/users/types';
import { Organisation } from '@/state/app/directory/organisations/types';
import { Form, FormInput, FormSelect } from '@/ui/controls';

type Props = {
    user: User;
    organisations: Organisation[];
    validationResults: ValidationResult[];
    onChange: (user: User) => void;
};

type State = {
    user: User;
};

class UserForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            user: props.user
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.user != prevProps.user)
            this.setState({
                user: this.props.user
            });
    }

    handleChange = (fieldName: string, value: any) => {
        const user = {
            ...this.state.user,
            [fieldName]: value
        };
        this.setState({
            user: user
        });
        this.props.onChange(user);
    };

    render() {
        const { validationResults } = this.props;
        const { user } = this.state;

        if (!user) return <></>;

        return (
            <Form>
                <FormInput
                    fieldName="firstName"
                    label="First Name"
                    value={user.firstName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="lastName"
                    label="Last Name"
                    value={user.lastName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="login"
                    label="Login"
                    value={user.login}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormInput
                    fieldName="email"
                    label="Email"
                    value={user.email}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormSelect
                    fieldName="organisationId"
                    label="Organisation"
                    value={user.organisationId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.organisations}
                    optionsValue="id"
                    optionsText="name"
                />
            </Form>
        );
    }
}

export default UserForm;

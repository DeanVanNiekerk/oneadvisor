// @flow

import React, { Component } from 'react';

import type { ValidationResult } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import type { User } from '@/state/app/directory/users/types';
import { Form, FormInput } from '@/ui/controls';
import { getValidationError } from '@/state/validation';

type Props = {
    user: User,
    validationResults: ValidationResult[],
    onChange: (user: User) => void
};

type State = {
    user: User
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

    handleChange = (fieldName: string, event: SyntheticInputEvent<any>) => {
        const user = {
            ...this.state.user,
            [fieldName]: event.target.value
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
                <FormInput
                    fieldName="organisationId"
                    label="Organisation"
                    value={user.organisationId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
            </Form>
        );
    }
}

export default UserForm;

// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import type { ValidationResult } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import type { User } from '@/state/app/directory/users/types';
import { Form, FormField } from '@/ui/controls';
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

        return (
            <Form>
                <FormField
                    fieldName="firstName"
                    label="First Name"
                    value={this.state.user.firstName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
                <FormField
                    fieldName="lastName"
                    label="Last Name"
                    value={this.state.user.lastName}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                />
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => ({});

export default connect(mapStateToProps)(UserForm);

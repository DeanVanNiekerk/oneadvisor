// @flow

import React, { Component } from 'react';
import { Form, Input } from 'antd';

import type { ValidationResult } from '@/state/types';
import { getValidationError } from '@/state/validation';

const FormItem = Form.Item;

type Props = {
    fieldName: string,
    label: string,
    validationResults: ValidationResult[],
    children: React.Node
};

type State = {
    errorText: string | null,
    validationResults: ValidationResult[]
};

class FormField extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            errorText: getValidationError(
                props.fieldName,
                props.validationResults
            ),
            validationResults: props.validationResults
        };
    }

    componentDidUpdate(nextProps: Props) {

        console.log(nextProps);

        if (nextProps.validationResults !== this.state.validationResults) {
            this.setState({
                errorText: getValidationError(
                    nextProps.fieldName,
                    nextProps.validationResults
                ),
                validationResults: nextProps.validationResults
            });
        }
    }

    render() {
        const { errorText } = this.state;
        const { label, children } = this.props;

        return (
            <FormItem
                label={label}
                validateStatus={errorText ? "error" : null}
                help={errorText}
            >
                {children}
            </FormItem>
        );
    }
}

export { FormField };

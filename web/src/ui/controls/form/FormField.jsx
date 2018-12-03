// @flow

import * as React from 'react';
import { Form, Input } from 'antd';

import type { ValidationResult } from '@/state/types';
import { getValidationError } from '@/state/validation';

const FormItem = Form.Item;

type Props = {
    fieldName: string,
    label: string,
    value: any,
    validationResults: ValidationResult[],
    children: React.Node
};

class FormField extends React.Component<Props> {
    getErrorText = (): ?string => {
        const result = getValidationError(
            this.props.fieldName,
            this.props.validationResults
        );

        //There is no validation error
        if (!result) return null;

        //If the value has changed then dont show message
        if (result.attemptedValue != this.props.value) return null;

        return result.errorMessage;
    };

    render() {
        const errorText = this.getErrorText();
        const { label, value, children } = this.props;

        return (
            <FormItem
                label={label}
                validateStatus={errorText ? 'error' : null}
                help={errorText}
            >
                {children}
            </FormItem>
        );
    }
}

export { FormField };

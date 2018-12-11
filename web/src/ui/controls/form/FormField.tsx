import { Form } from 'antd';
import React, { ReactNode } from 'react';

import { ValidationResult } from '@/state/types';
import { getValidationError } from '@/state/validation';

const FormItem = Form.Item;

type Props = {
    fieldName: string;
    label: string;
    value: any;
    validationResults: ValidationResult[];
    children: ReactNode;
};

class FormField extends React.Component<Props> {
    getErrorText = (): string | null => {
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
        const { label, children } = this.props;

        return (
            <FormItem
                label={label}
                validateStatus={errorText ? 'error' : undefined}
                help={errorText}
            >
                {children}
            </FormItem>
        );
    }
}

export { FormField };

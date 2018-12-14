import { Form } from 'antd';
import React, { ReactNode } from 'react';

import { ValidationResult } from '@/app/types';
import { getValidationError } from '@/app/validation';

import { FormLayout } from './Form';

const FormItem = Form.Item;

type Props = {
    label: string;
    children: ReactNode;
    value?: any;
    fieldName?: string;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
};

class FormField extends React.Component<Props> {
    getErrorText = (): string | null => {
        const result = getValidationError(
            this.props.fieldName || '',
            this.props.validationResults || []
        );

        //There is no validation error
        if (!result) return null;

        //If the value has changed then dont show message
        if (result.attemptedValue != this.props.value) return null;

        return result.errorMessage;
    };

    render() {
        const errorText = this.getErrorText();
        const { label, children, layout } = this.props;

        const formItemLayout =
            layout === 'horizontal'
                ? {
                      labelCol: { span: 6 },
                      wrapperCol: { span: 18 }
                  }
                : null;

        return (
            <FormItem
                label={label}
                validateStatus={errorText ? 'error' : undefined}
                help={errorText}
                {...formItemLayout}
            >
                {children}
            </FormItem>
        );
    }
}

export { FormField };

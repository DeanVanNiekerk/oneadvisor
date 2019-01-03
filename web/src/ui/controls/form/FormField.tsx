import { Form, Spin } from 'antd';
import React, { ReactNode } from 'react';

import { getValidationError, ValidationResult } from '@/app/validation';

import { FormLayout } from './Form';

const FormItem = Form.Item;

type Props = {
    label?: string;
    children: ReactNode;
    value?: any;
    fieldName?: string;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    loading?: boolean;
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
        if (
            this.formatValue(result.attemptedValue) !==
            this.formatValue(this.props.value)
        )
            return null;

        return result.errorMessage;
    };

    formatValue = (value: any) => {
        if (value === undefined || value === null) return '';
        return value.toString().toLowerCase();
    };

    render() {
        const errorText = this.getErrorText();
        const { label, children, layout, loading } = this.props;

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
                {loading && <Spin spinning={true} size="small" />}
                {!loading && children}
            </FormItem>
        );
    }
}

export { FormField };

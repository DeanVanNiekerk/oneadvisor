import { InputNumber } from 'antd';
import React, { Component } from 'react';

import { formatCurrency, parseCurrency } from '@/app/utils';
import { ValidationResult } from '@/app/validation';

import { FormText } from './';
import { FormLayout } from './Form';
import { FormField } from './FormField';

type Props = {
    fieldName: string;
    label: string;
    value: any;
    disabled?: boolean;
    onChange?: (fieldName: string, value: any | undefined) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    readonly?: boolean;
    min?: number;
    max?: number;
    autoFocus?: boolean;
    step?: number | string;
    precision?: number;
};

class FormInputNumber extends Component<Props> {
    onChange = (value: number | undefined) => {
        if (this.props.onChange)
            this.props.onChange(this.props.fieldName, value);
    };

    render() {
        const {
            fieldName,
            label,
            value,
            validationResults,
            disabled = false,
            layout,
            readonly,
            autoFocus,
            step,
            precision = 2,
        } = this.props;

        if (readonly)
            return <FormText label={label} value={value} layout={layout} />;

        return (
            <FormField
                label={label}
                fieldName={fieldName}
                validationResults={validationResults}
                value={value}
                layout={layout}
            >
                <InputNumber
                    disabled={disabled}
                    name={fieldName}
                    id={fieldName}
                    value={value}
                    onChange={this.onChange}
                    decimalSeparator="."
                    precision={precision}
                    style={{
                        width: "100%",
                    }}
                    autoFocus={autoFocus}
                    step={step}
                />
            </FormField>
        );
    }
}

export { FormInputNumber };

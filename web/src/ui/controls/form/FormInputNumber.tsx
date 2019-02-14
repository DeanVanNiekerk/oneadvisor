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
    onChange?: (fieldName: string, value: any) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    readonly?: boolean;
    min?: number;
    max?: number;
    isCurrency?: boolean;
};

class FormInputNumber extends Component<Props> {
    onChange = (value: number | string | undefined) => {
        if (this.props.onChange)
            this.props.onChange(this.props.fieldName, value);
    };

    currencyFormatter = (value: number) => {
        return `R ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    currencyParser = (value: string) => {
        return value.replace(/\R\s?|(,*)/g, '');
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
            isCurrency
        } = this.props;

        if (readonly)
            return <FormText label={label} value={value} layout={layout} />;

        let formatter: any;
        let parser: any;
        if (isCurrency) {
            formatter = this.currencyFormatter;
            parser = this.currencyParser;
        }

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
                    formatter={formatter}
                    parser={parser}
                    //width="100%"
                    style={{
                        width: '100%'
                    }}
                />
            </FormField>
        );
    }
}

export { FormInputNumber };

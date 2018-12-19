import { Input } from 'antd';
import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';

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
    addonAfter?: React.ReactNode;
};

class FormInput extends Component<Props> {
    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.onChange)
            this.props.onChange(this.props.fieldName, event.target.value);
    };

    render() {
        const {
            fieldName,
            label,
            value,
            validationResults,
            disabled = false,
            layout,
            addonAfter
        } = this.props;

        return (
            <FormField
                label={label}
                fieldName={fieldName}
                validationResults={validationResults}
                value={value}
                layout={layout}
            >
                <Input
                    disabled={disabled}
                    name={fieldName}
                    id={fieldName}
                    value={value}
                    onChange={this.onChange}
                    addonAfter={addonAfter}
                />
            </FormField>
        );
    }
}

export { FormInput };

import { Input } from 'antd';
import React, { Component } from 'react';

import { ValidationResult } from '@/app/types';

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
            layout
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
                />
            </FormField>
        );
    }
}

export { FormInput };

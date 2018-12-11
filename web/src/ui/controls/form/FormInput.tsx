import { Input } from 'antd';
import React, { Component } from 'react';

import { ValidationResult } from '@/state/types';

import { FormField } from './FormField';

type Props = {
    fieldName: string;
    label: string;
    value: any;
    onChange?: (fieldName: string, value: any) => void;
    validationResults?: ValidationResult[];
};

class FormInput extends Component<Props> {
    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.onChange)
            this.props.onChange(this.props.fieldName, event.target.value);
    };

    render() {
        const { fieldName, label, value, validationResults } = this.props;

        return (
            <FormField
                label={label}
                fieldName={fieldName}
                validationResults={validationResults || []}
                value={value}
            >
                <Input
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



import React, { Component } from 'react';
import { Form, Input } from 'antd';

import { FormField } from './FormField';
import { ValidationResult } from '@/state/types';

type Props = {
    fieldName: string,
    label: string,
    value: any,
    onChange: (fieldName: string, value: any) => void,
    validationResults: ValidationResult[]
};

class FormInput extends Component<Props> {

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(this.props.fieldName, event.target.value);
    };

    render() {
        const {
            fieldName,
            label,
            value,
            validationResults
        } = this.props;

        return (
            <FormField
                label={label}
                fieldName={fieldName}
                validationResults={validationResults}
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

// @flow

import React, { Component } from 'react';
import { Form, Input } from 'antd';

import { FormField } from './FormField';
import type { ValidationResult } from '@/state/types';
import { removeValidationError } from '@/state/validation';

const FormItem = Form.Item;

type Props = {
    fieldName: string,
    label: string,
    value: any,
    onChange: (fieldName: string, value: any) => void,
    validationResults: ValidationResult[]
};

class FormInput extends Component<Props> {
    onChange = (event: SyntheticInputEvent<any>) => {
        this.props.onChange(this.props.fieldName, event.target.value);
    };

    render() {
        const {
            fieldName,
            label,
            value,
            onChange,
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

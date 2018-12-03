// @flow

import React, { Component } from 'react';
import { Select } from 'antd';

import { FormField } from './FormField';
import type { ValidationResult } from '@/state/types';
import { removeValidationError } from '@/state/validation';

const Option = Select.Option;

type Props = {
    fieldName: string,
    label: string,
    value: any,
    options: any[],
    optionsValue: string,
    optionsText: string,
    onChange: (fieldName: string, value: any) => void,
    validationResults: ValidationResult[]
};

class FormSelect extends Component<Props> {
    onChange = (value: any) => {
        this.props.onChange(this.props.fieldName, value);
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
                <Select
                    value={value}
                    onChange={this.onChange}
                >
                    {this.props.options.map(option => (
                        <Option key={option[this.props.optionsValue]} value={option[this.props.optionsValue]}>{option[this.props.optionsText]}</Option>
                    ))}
                </Select>
            </FormField>
        );
    }
}

export { FormSelect };

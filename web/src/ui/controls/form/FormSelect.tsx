import { Select } from 'antd';
import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';

import { FormLayout } from './Form';
import { FormField } from './FormField';

const Option = Select.Option;

type Props = {
    fieldName: string;
    label: string;
    value: any;
    options: any[];
    optionsValue: string;
    optionsText: string;
    disabled?: boolean;
    defaultActiveFirstOption?: boolean;
    onChange?: (fieldName: string, value: any) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    loading?: boolean;
};

class FormSelect extends Component<Props> {
    onChange = (value: any) => {
        if (this.props.onChange)
            this.props.onChange(this.props.fieldName, value);
    };

    render() {
        const {
            fieldName,
            label,
            value,
            disabled = false,
            validationResults,
            layout,
            defaultActiveFirstOption = true,
            loading = false
        } = this.props;

        return (
            <FormField
                label={label}
                fieldName={fieldName}
                validationResults={validationResults}
                value={value}
                layout={layout}
                loading={loading}
            >
                <Select
                    value={value}
                    onChange={this.onChange}
                    disabled={disabled}
                    defaultActiveFirstOption={defaultActiveFirstOption}
                >
                    {this.props.options.map(option => (
                        <Option
                            key={option[this.props.optionsValue]}
                            value={option[this.props.optionsValue]}
                        >
                            {option[this.props.optionsText]}
                        </Option>
                    ))}
                </Select>
            </FormField>
        );
    }
}

export { FormSelect };

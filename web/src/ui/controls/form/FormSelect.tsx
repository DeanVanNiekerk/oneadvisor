import { Select } from 'antd';
import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';

import { FormText } from './';
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
    readonly?: boolean;
};

class FormSelect extends Component<Props> {
    onChange = (value: any) => {
        if (this.props.onChange)
            this.props.onChange(this.props.fieldName, value);
    };

    getValue = (): string => {
        const item = this.props.options.find(
            o => o[this.props.optionsValue] === this.props.value
        );

        if (!item) return '';

        return item[this.props.optionsText];
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
            loading = false,
            readonly
        } = this.props;

        if (readonly)
            return (
                <FormText
                    label={label}
                    value={this.getValue()}
                    layout={layout}
                />
            );

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
                    style={{
                        minWidth: "180px"
                    }}
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

import { Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';

import { FormText } from './';
import { FormLayout } from './Form';
import { FormField } from './FormField';

const Option = Select.Option;

type Props<T = SelectValue> = {
    fieldName: string;
    label: string;
    value: any;
    options: any[];
    optionsValue: string;
    optionsText: string;
    validationFieldName?: string;
    disabled?: boolean;
    defaultActiveFirstOption?: boolean;
    onChange?: (fieldName: string, value: T) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    loading?: boolean;
    readonly?: boolean;
    autoFocus?: boolean;
    notFoundContent?: React.ReactNode;
    placeholder?: React.ReactNode;
    showSearch?: boolean;
    showArrow?: boolean;
    filterOption?: boolean;
    onSearch?: (value: string) => any;
    onSelect?: (value: SelectValue, option: React.ReactElement<any>) => any;
    minWidth?: string;
    width?: string;
    hidden?: boolean;
    allowClear?: boolean;
};

class FormSelect<T> extends Component<Props<T>> {
    onChange = (value: T): void => {
        if (this.props.onChange)
            this.props.onChange(this.props.fieldName, value);
    };

    getValue = (): string => {
        const item = this.props.options.find(
            o => o[this.props.optionsValue] === this.props.value
        );

        if (!item) return "";

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
            readonly,
            autoFocus = false,
        } = this.props;

        if (readonly)
            return (
                <FormText
                    label={label}
                    value={this.getValue()}
                    layout={layout}
                />
            );

        if (this.props.hidden) return <></>;

        const style: any = {
            minWidth: this.props.minWidth || "180px",
        };
        if (this.props.width) {
            style.width = this.props.width;
        }

        return (
            <FormField
                label={label}
                fieldName={fieldName}
                validationResults={validationResults}
                value={value}
                layout={layout}
                loading={loading}
                validationFieldName={this.props.validationFieldName}
            >
                <Select<any>
                    showSearch={this.props.showSearch}
                    showArrow={this.props.showArrow}
                    filterOption={this.props.filterOption}
                    onSearch={this.props.onSearch}
                    notFoundContent={this.props.notFoundContent}
                    placeholder={this.props.placeholder}
                    style={style}
                    value={value}
                    onChange={this.onChange}
                    disabled={disabled}
                    defaultActiveFirstOption={defaultActiveFirstOption}
                    autoFocus={autoFocus}
                    allowClear={this.props.allowClear}
                    onSelect={this.props.onSelect}
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

import { Select } from "antd";
import { OptionProps } from "antd/lib/select";
import React, { Component } from "react";

import { ValidationResult } from "@/app/validation";

import { FormText } from "./";
import { FormLayout } from "./Form";
import { FormField } from "./FormField";

const Option = Select.Option;

type Props<T> = {
    fieldName: string;
    label: string;
    value: T;
    options: object[];
    optionsValue: string;
    optionsText: string;
    onOptionsText?: (value: object) => React.ReactNode;
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
    filterOption?: boolean | ((inputValue: string, option: React.ReactElement<OptionProps>) => boolean);
    onSearch?: (value: string) => void;
    onSelect?: (value: T, option: React.ReactElement) => void;
    minWidth?: string;
    width?: string;
    hidden?: boolean;
    allowClear?: boolean;
    addonAfter?: React.ReactNode;
};

class FormSelect<T> extends Component<Props<T>> {
    onChange = (value: T): void => {
        if (this.props.onChange) this.props.onChange(this.props.fieldName, value);
    };

    getLabelValue = (): string => {
        const item = this.props.options.find(o => o[this.props.optionsValue] === this.props.value);

        if (!item) return "";

        return item[this.props.optionsText];
    };

    getOptionsText = (option: object): React.ReactNode => {
        if (this.props.onOptionsText) return this.props.onOptionsText(option);
        return option[this.props.optionsText];
    };

    render() {
        const {
            fieldName,
            label,
            disabled = false,
            validationResults,
            layout,
            defaultActiveFirstOption = true,
            loading = false,
            readonly,
            autoFocus = false,
        } = this.props;

        const { value } = this.props;

        const labelValue = this.getLabelValue();

        if (readonly) return <FormText label={label} value={labelValue} layout={layout} />;

        if (this.props.hidden) return <></>;

        const style: React.CSSProperties = {
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
                //@ts-ignore
                <Select<T>
                    showSearch={this.props.showSearch}
                    showArrow={this.props.showArrow}
                    filterOption={this.props.filterOption}
                    onSearch={this.props.onSearch}
                    notFoundContent={this.props.notFoundContent}
                    placeholder={this.props.placeholder}
                    style={style}
                    value={labelValue === "" ? "" : value}
                    onChange={this.onChange}
                    disabled={disabled}
                    defaultActiveFirstOption={defaultActiveFirstOption}
                    autoFocus={autoFocus}
                    allowClear={this.props.allowClear}
                    onSelect={this.props.onSelect}
                >
                    {this.props.options.map(option => (
                        <Option key={option[this.props.optionsValue]} value={option[this.props.optionsValue]}>
                            {this.getOptionsText(option)}
                        </Option>
                    ))}
                </Select>
                {this.props.addonAfter}
            </FormField>
        );
    }
}

export { FormSelect };

import { Input } from 'antd';
import React, { Component, KeyboardEventHandler } from 'react';

import { ValidationResult } from '@/app/validation';

import { FormText } from './';
import { FormLayout } from './Form';
import { FormField } from './FormField';

declare const InputSizes: ["small", "default", "large"];

type Props = {
    fieldName: string;
    label?: string;
    value: any;
    disabled?: boolean;
    onChange?: (fieldName: string, value: any) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    addonAfter?: React.ReactNode;
    prefix?: React.ReactNode;
    autoFocus?: boolean;
    readonly?: boolean;
    placeholder?: string;
    size?: (typeof InputSizes)[number];
    formFieldStyle?: React.CSSProperties;
    type?: string;
    onKeyPress?: KeyboardEventHandler<HTMLInputElement>;
    validationFieldName?: string;
    width?: number | string;
    hidden?: boolean;
};

class FormInput extends Component<Props> {
    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.onChange)
            this.props.onChange(this.props.fieldName, event.target.value);
    };

    render() {
        const {
            fieldName,
            label = "",
            value,
            validationResults,
            disabled = false,
            layout,
            addonAfter,
        } = this.props;

        if (this.props.readonly)
            return <FormText label={label} value={value} layout={layout} />;

        if (this.props.hidden) return <></>;

        const style: any = {};
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
                style={this.props.formFieldStyle}
                validationFieldName={this.props.validationFieldName}
            >
                <Input
                    onKeyPress={this.props.onKeyPress}
                    size={this.props.size}
                    type={this.props.type}
                    placeholder={this.props.placeholder}
                    prefix={this.props.prefix}
                    autoFocus={this.props.autoFocus}
                    disabled={disabled}
                    name={fieldName}
                    id={fieldName}
                    value={value}
                    onChange={this.onChange}
                    addonAfter={addonAfter}
                    style={style}
                />
            </FormField>
        );
    }
}

export { FormInput };
import { Input } from 'antd';
import React, { Component, KeyboardEventHandler } from 'react';

import { ValidationResult } from '@/app/validation';

import { FormText } from './';
import { FormLayout } from './Form';
import { FormField } from './FormField';

declare const InputSizes: ['small', 'default', 'large'];

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
};

class FormInput extends Component<Props> {
    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.onChange)
            this.props.onChange(this.props.fieldName, event.target.value);
    };

    render() {
        const {
            fieldName,
            label = '',
            value,
            validationResults,
            disabled = false,
            layout,
            addonAfter,
            readonly
        } = this.props;

        if (readonly)
            return <FormText label={label} value={value} layout={layout} />;

        return (
            <FormField
                label={label}
                fieldName={fieldName}
                validationResults={validationResults}
                value={value}
                layout={layout}
                style={this.props.formFieldStyle}
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
                />
            </FormField>
        );
    }
}

export { FormInput };

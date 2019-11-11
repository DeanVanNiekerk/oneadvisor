import { Input } from "antd";
import React, { KeyboardEventHandler } from "react";

import { ValidationResult } from "@/app/validation";

import { FormText } from "./";
import { FormLayout } from "./Form";
import { FormField } from "./FormField";

declare const InputSizes: ["small", "default", "large"];

type Props = {
    fieldName: string;
    label?: string;
    value: string;
    disabled?: boolean;
    onChange?: (fieldName: string, value: string) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    addonAfter?: React.ReactNode;
    prefix?: React.ReactNode;
    autoFocus?: boolean;
    readonly?: boolean;
    placeholder?: string;
    size?: typeof InputSizes[number];
    formFieldStyle?: React.CSSProperties;
    type?: string;
    onKeyPress?: KeyboardEventHandler<HTMLInputElement>;
    validationFieldName?: string;
    width?: number | string;
    hidden?: boolean;
};

const FormInputPassword: React.FC<Props> = (props: Props) => {
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (props.onChange) props.onChange(props.fieldName, event.target.value);
    };

    const { fieldName, label = "", value, validationResults, disabled = false, layout, addonAfter } = props;

    if (props.readonly) return <FormText label={label} value={value} layout={layout} />;

    if (props.hidden) return <React.Fragment />;

    const style: React.CSSProperties = {};
    if (props.width) {
        style.width = props.width;
    }

    return (
        <FormField
            label={label}
            fieldName={fieldName}
            validationResults={validationResults}
            value={value}
            layout={layout}
            style={props.formFieldStyle}
            validationFieldName={props.validationFieldName}
        >
            <Input.Password
                onKeyPress={props.onKeyPress}
                size={props.size}
                type={props.type}
                placeholder={props.placeholder}
                prefix={props.prefix}
                autoFocus={props.autoFocus}
                disabled={disabled}
                name={fieldName}
                id={fieldName}
                value={value}
                onChange={onChange}
                addonAfter={addonAfter}
                style={style}
            />
        </FormField>
    );
};

export { FormInputPassword };

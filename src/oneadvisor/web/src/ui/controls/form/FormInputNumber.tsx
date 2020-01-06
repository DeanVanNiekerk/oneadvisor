import { InputNumber } from "antd";
import React from "react";

import { ValidationResult } from "@/app/validation";

import { FormText } from "./";
import { FormLayout } from "./Form";
import { FormField } from "./FormField";

type Props = {
    fieldName: string;
    label: string;
    value: number | undefined;
    disabled?: boolean;
    onChange?: (fieldName: string, value: number | undefined) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    readonly?: boolean;
    min?: number;
    max?: number;
    autoFocus?: boolean;
    step?: number | string;
    precision?: number;
    validationFieldName?: string;
    width?: number | string;
};

const FormInputNumber: React.FC<Props> = (props: Props) => {
    const onChange = (value: number | undefined) => {
        if (props.onChange) props.onChange(props.fieldName, value);
    };

    const {
        fieldName,
        label,
        value,
        validationResults,
        disabled = false,
        layout,
        readonly,
        autoFocus,
        step,
        precision = 2,
    } = props;

    if (readonly) return <FormText label={label} value={value} layout={layout} />;

    const style: React.CSSProperties = {
        width: "100%",
    };
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
            validationFieldName={props.validationFieldName}
        >
            <InputNumber
                disabled={disabled}
                name={fieldName}
                id={fieldName}
                value={value}
                onChange={onChange}
                decimalSeparator="."
                precision={precision}
                style={style}
                autoFocus={autoFocus}
                step={step}
                min={props.min}
                max={props.max}
            />
        </FormField>
    );
};

export { FormInputNumber };

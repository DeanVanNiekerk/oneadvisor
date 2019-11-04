import { Switch } from "antd";
import React from "react";

import { ValidationResult } from "@/app/validation";

import { FormLayout } from "./Form";
import { FormField } from "./FormField";

type Props = {
    fieldName: string;
    label: React.ReactNode;
    extra?: React.ReactNode;
    value: boolean | undefined;
    disabled?: boolean;
    onChange?: (fieldName: string, value: boolean) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    readonly?: boolean;
    className?: string;
};

const FormSwitch: React.FC<Props> = (props: Props) => {
    const onChange = (checked: boolean) => {
        if (props.onChange) props.onChange(props.fieldName, checked);
    };

    const { fieldName, label, value, validationResults, disabled = false, layout, readonly, extra } = props;

    return (
        <FormField
            label={label}
            extra={extra}
            fieldName={fieldName}
            validationResults={validationResults}
            value={value}
            layout={layout}
        >
            <Switch disabled={disabled || readonly} checked={value} onChange={onChange} className={props.className} />
        </FormField>
    );
};

export { FormSwitch };

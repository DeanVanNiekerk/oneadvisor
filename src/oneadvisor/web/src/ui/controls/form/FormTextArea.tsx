import { Input } from "antd";
import React from "react";

import { ValidationResult } from "@/app/validation/types";

import { FormLayout } from "./Form";
import { FormField } from "./FormField";

const { TextArea } = Input;

type Props = {
    fieldName: string;
    label?: string;
    value: string;
    disabled?: boolean;
    onChange?: (fieldName: string, value: string) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    autoFocus?: boolean;
    readonly?: boolean;
    validationFieldName?: string;
    hidden?: boolean;
    rows?: number;
};

const FormTextArea: React.FC<Props> = (props: Props) => {
    const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (props.onChange) props.onChange(props.fieldName, event.target.value);
    };

    const {
        fieldName,
        label = "",
        value,
        validationResults,
        disabled = false,
        layout,
        rows,
    } = props;

    if (props.hidden) return <React.Fragment />;

    return (
        <FormField
            label={label}
            fieldName={fieldName}
            validationResults={validationResults}
            value={value}
            layout={layout}
            validationFieldName={props.validationFieldName}
        >
            <TextArea
                autoFocus={props.autoFocus}
                disabled={disabled || props.readonly}
                name={fieldName}
                id={fieldName}
                value={value}
                onChange={onChange}
                rows={rows}
            />
        </FormField>
    );
};

export { FormTextArea };

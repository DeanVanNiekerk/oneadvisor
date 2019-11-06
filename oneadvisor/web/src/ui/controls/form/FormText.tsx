import React from "react";

import { ValidationResult } from "@/app/validation";

import { FormLayout } from "./Form";
import { FormField } from "./FormField";

type Props = {
    label: string;
    value: string | React.ReactNode;
    fieldName?: string;
    layout?: FormLayout;
    loading?: boolean;
    validationResults?: ValidationResult[];
    extra?: React.ReactNode;
    emptyValueText?: React.ReactNode;
};

const FormText: React.FC<Props> = (props: Props) => (
    <FormField
        label={props.label}
        value={props.value}
        layout={props.layout}
        loading={props.loading}
        fieldName={props.fieldName}
        validationResults={props.validationResults}
    >
        <span className="ant-form-text">{!props.value ? props.emptyValueText : props.value}</span>
        <span style={{ float: "right" }}>{props.extra}</span>
    </FormField>
);

export { FormText };

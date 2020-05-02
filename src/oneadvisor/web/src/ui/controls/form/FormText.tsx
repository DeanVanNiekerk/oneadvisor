import { Typography } from "antd";
import React from "react";

import { ValidationResult } from "@/app/validation/types";

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
        <React.Fragment>
            <Typography.Text>{!props.value ? props.emptyValueText : props.value}</Typography.Text>
            <span style={{ float: "right" }}>{props.extra}</span>
        </React.Fragment>
    </FormField>
);

export { FormText };

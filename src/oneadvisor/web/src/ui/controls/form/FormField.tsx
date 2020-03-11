import { Form, Spin } from "antd";
import React, { ReactNode } from "react";

import { formatValue, getValidationError, ValidationResult } from "@/app/validation";

import { FormLayout } from "./Form";

const FormItem = Form.Item;

type Props = {
    label?: React.ReactNode;
    extra?: React.ReactNode;
    children: React.ReactNode;
    value?: React.ReactNode;
    fieldName?: string;
    validationFieldName?: string;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    loading?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

const FormField: React.FC<Props> = (props: Props) => {
    const getErrorText = (): string | null => {
        const result = getValidationError(
            props.validationFieldName || props.fieldName || "",
            props.validationResults || []
        );

        //There is no validation error
        if (!result) return null;

        //Must be primative type
        if (
            typeof props.value !== "boolean" &&
            typeof props.value !== "number" &&
            typeof props.value !== "string" &&
            props.value !== undefined &&
            props.value !== null
        )
            return null;

        //If the value has changed then dont show message
        if (formatValue(result.attemptedValue) !== formatValue(props.value)) return null;

        return result.errorMessage;
    };

    const errorText = getErrorText();
    const { label, layout, loading, extra } = props;

    const formItemLayout =
        layout === "horizontal"
            ? {
                  labelCol: { span: 6 },
                  wrapperCol: { span: 18 },
              }
            : null;

    let children = props.children;

    if (loading) children = <Spin spinning={true} size="small" />;

    return (
        <FormItem
            extra={extra}
            label={label}
            validateStatus={errorText ? "error" : undefined}
            help={errorText}
            {...formItemLayout}
            className={props.className}
            style={props.style}
        >
            {children}
        </FormItem>
    );
};

export { FormField };

import { Form, Spin } from "antd";
import React, { ReactNode } from "react";

import { formatValue, getValidationError, ValidationResult } from "@/app/validation";

import { FormLayout } from "./Form";

const FormItem = Form.Item;

type Props = {
    label?: React.ReactNode;
    extra?: React.ReactNode;
    children: ReactNode;
    value?: any;
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
            props.validationFieldName || props.fieldName || '',
            props.validationResults || []
        );

        //There is no validation error
        if (!result) return null;

        //If the value has changed then dont show message
        if (
            formatValue(result.attemptedValue) !== formatValue(props.value)
        )
            return null;

        return result.errorMessage;
    };

    const errorText = getErrorText();
    const { label, children, layout, loading, extra } = props;

    const formItemLayout =
        layout === 'horizontal'
            ? {
                labelCol: { span: 6 },
                wrapperCol: { span: 18 }
            }
            : null;

    return (
        <FormItem
            extra={extra}
            label={label}
            validateStatus={errorText ? 'error' : undefined}
            help={errorText}
            {...formItemLayout}
            className={props.className}
            style={props.style}
        >
            {loading && <Spin spinning={true} size="small" />}
            {!loading && children}
        </FormItem>
    );
}

export { FormField };

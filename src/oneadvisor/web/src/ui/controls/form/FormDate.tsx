import { DatePicker } from "antd";
import moment from "moment";
import React from "react";

import { DATE_FORMAT } from "@/app/utils";
import { ValidationResult } from "@/app/validation";

import { FormText } from "./";
import { FormLayout } from "./Form";
import { FormField } from "./FormField";

type Props = {
    fieldName: string;
    label: string;
    extra?: React.ReactNode;
    value: string | number | undefined | null;
    disabled?: boolean;
    onChange?: (fieldName: string, value: string | null) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    readonly?: boolean;
    hidden?: boolean;
    allowClear?: boolean;
};

const FormDate: React.FC<Props> = (props: Props) => {
    const onChange = (date: moment.Moment, dateString: string) => {
        if (props.onChange) props.onChange(props.fieldName, dateString ? dateString : null);
    };

    const {
        fieldName,
        label,
        value,
        validationResults,
        disabled = false,
        layout,
        readonly,
        extra,
        allowClear,
    } = props;

    if (readonly)
        return (
            <FormText
                label={label}
                value={value ? moment(value).format(DATE_FORMAT) : ""}
                layout={layout}
            />
        );

    if (props.hidden) return <React.Fragment />;

    return (
        <FormField
            label={label}
            fieldName={fieldName}
            validationResults={validationResults}
            value={value}
            layout={layout}
            extra={extra}
        >
            <DatePicker
                disabled={disabled}
                name={fieldName}
                value={value ? moment(value) : undefined}
                onChange={onChange}
                allowClear={allowClear}
            />
        </FormField>
    );
};

export { FormDate };

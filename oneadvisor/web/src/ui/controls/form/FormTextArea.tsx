import { Input } from "antd";
import React, { Component } from "react";

import { ValidationResult } from "@/app/validation";

import { FormLayout } from "./Form";
import { FormField } from "./FormField";

const { TextArea } = Input;

type Props = {
    fieldName: string;
    label?: string;
    value: any;
    disabled?: boolean;
    onChange?: (fieldName: string, value: any) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    autoFocus?: boolean;
    readonly?: boolean;
    validationFieldName?: string;
    hidden?: boolean;
    rows?: number;
};

class FormTextArea extends Component<Props> {
    onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (this.props.onChange) this.props.onChange(this.props.fieldName, event.target.value);
    };

    render() {
        const { fieldName, label = "", value, validationResults, disabled = false, layout, rows } = this.props;

        if (this.props.hidden) return <></>;

        return (
            <FormField
                label={label}
                fieldName={fieldName}
                validationResults={validationResults}
                value={value}
                layout={layout}
                validationFieldName={this.props.validationFieldName}
            >
                <TextArea
                    autoFocus={this.props.autoFocus}
                    disabled={disabled || this.props.readonly}
                    name={fieldName}
                    id={fieldName}
                    value={value}
                    onChange={this.onChange}
                    rows={rows}
                />
            </FormField>
        );
    }
}

export { FormTextArea };

import { Cascader } from "antd";
import { CascaderOptionType } from "antd/lib/cascader";
import React, { Component } from "react";

import { ValidationResult } from "@/app/validation";

import { FormLayout } from "./Form";
import { FormField } from "./FormField";

type Props = {
    fieldName: string;
    label: string;
    value: string[];
    options: CascaderOptionType[];
    layout?: FormLayout;
    readonly?: boolean;
    validationResults?: ValidationResult[];
    validationFieldName?: string;
    showSearch?: boolean;
    onChange?: (values: string[]) => void;
    changeOnSelect?: boolean;
};

class FormCascade extends Component<Props> {
    filter = (inputValue: string, path: CascaderOptionType[]) => {
        return path.some(
            option => (option.label ? option.label.toString() : "").toLowerCase().indexOf(inputValue.toLowerCase()) > -1
        );
    };

    render() {
        const { fieldName, label, validationResults, layout, readonly } = this.props;

        return (
            <FormField
                label={label}
                fieldName={fieldName}
                validationResults={validationResults}
                layout={layout}
                validationFieldName={this.props.validationFieldName}
            >
                <Cascader
                    options={this.props.options}
                    onChange={this.props.onChange}
                    placeholder=""
                    showSearch={this.props.showSearch ? { filter: this.filter } : false}
                    changeOnSelect={this.props.changeOnSelect}
                    value={this.props.value}
                    disabled={readonly}
                />
            </FormField>
        );
    }
}

export { FormCascade };

import { Cascader } from "antd";
import { CascaderOptionType } from "antd/lib/cascader";
import React from "react";

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

const filter = (inputValue: string, path: CascaderOptionType[]) => {
    return path.some(
        option => (option.label ? option.label.toString() : "").toLowerCase().indexOf(inputValue.toLowerCase()) > -1
    );
};

const FormCascade: React.FC<Props> = (props: Props) => {
    const { fieldName, label, validationResults, layout, readonly } = props;

    return (
        <FormField
            label={label}
            fieldName={fieldName}
            validationResults={validationResults}
            layout={layout}
            validationFieldName={props.validationFieldName}
        >
            <Cascader
                options={props.options}
                onChange={props.onChange}
                placeholder=""
                showSearch={props.showSearch ? { filter: filter } : false}
                changeOnSelect={props.changeOnSelect}
                value={props.value}
                disabled={readonly}
            />
        </FormField>
    );
};

export { FormCascade };

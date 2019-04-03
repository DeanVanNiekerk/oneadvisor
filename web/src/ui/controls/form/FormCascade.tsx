import { Cascader } from 'antd';
import { CascaderOptionType } from 'antd/lib/cascader';
import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';

import { FormText } from './';
import { FormLayout } from './Form';
import { FormField } from './FormField';

type Props = {
    fieldName: string;
    label: string;
    value: any;
    options: CascaderOptionType[];
    layout?: FormLayout;
    readonly?: boolean;
    validationResults?: ValidationResult[];
    validationFieldName?: string;
    showSearch?: boolean;
    onChange?: (fieldName: string, value: any) => void;
};

class FormCascade extends Component<Props> {
    onChange = (value: string[]) => {
        if (this.props.onChange)
            this.props.onChange(this.props.fieldName, value[value.length - 1]);
    };

    getTest = (): string => {
        return "TODO";
    };

    filter = (inputValue: string, path: CascaderOptionType[]) => {
        return path.some(
            option =>
                (option.label ? option.label.toString() : "")
                    .toLowerCase()
                    .indexOf(inputValue.toLowerCase()) > -1
        );
    };

    // getValues = (): string[] => {

    // };

    // findValue = (path: CascaderOptionType[], value: string): string => {

    //     var match = path.find(p => {
    //         return p.value === value;
    //     })

    //     if(!match)
    //         return "";

    //     return match.value

    // }

    render() {
        const {
            fieldName,
            label,
            value,
            validationResults,
            layout,
            readonly,
        } = this.props;

        if (readonly)
            return (
                <FormText
                    label={label}
                    value={this.getTest()}
                    layout={layout}
                />
            );

        return (
            <FormField
                label={label}
                fieldName={fieldName}
                validationResults={validationResults}
                value={value}
                layout={layout}
                validationFieldName={this.props.validationFieldName}
            >
                <Cascader
                    options={this.props.options}
                    onChange={this.onChange}
                    placeholder=""
                    showSearch={
                        this.props.showSearch ? { filter: this.filter } : false
                    }
                />
            </FormField>
        );
    }
}

export { FormCascade };

import { Switch } from 'antd';
import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';

import { FormLayout } from './Form';
import { FormField } from './FormField';

type Props = {
    fieldName: string;
    label: React.ReactNode;
    extra?: React.ReactNode;
    value: boolean | undefined;
    disabled?: boolean;
    onChange?: (fieldName: string, value: any) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    readonly?: boolean;
    className?: string;
};

class FormSwitch extends Component<Props> {
    onChange = (checked: boolean) => {
        if (this.props.onChange) this.props.onChange(this.props.fieldName, checked);
    };

    render() {
        const { fieldName, label, value, validationResults, disabled = false, layout, readonly, extra } = this.props;

        return (
            <FormField
                label={label}
                extra={extra}
                fieldName={fieldName}
                validationResults={validationResults}
                value={value}
                layout={layout}
            >
                <Switch
                    disabled={disabled || readonly}
                    checked={value}
                    onChange={this.onChange}
                    className={this.props.className}
                />
            </FormField>
        );
    }
}

export { FormSwitch };

import { Input } from 'antd';
import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';

import { FormText } from './';
import { FormLayout } from './Form';
import { FormField } from './FormField';

type Props = {
    fieldName: string;
    label: string;
    value: any;
    disabled?: boolean;
    onChange?: (fieldName: string, value: any) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    addonAfter?: React.ReactNode;
    focus?: boolean;
    readonly?: boolean;
};

class FormInput extends Component<Props> {
    private firstNameInput: Input | null;

    componentDidMount() {
        if (this.firstNameInput) {
            setTimeout(() => {
                if (this.firstNameInput) this.firstNameInput.focus();
            }, 100);
        }
    }

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (this.props.onChange)
            this.props.onChange(this.props.fieldName, event.target.value);
    };

    render() {
        const {
            fieldName,
            label,
            value,
            validationResults,
            disabled = false,
            layout,
            addonAfter,
            focus,
            readonly
        } = this.props;

        if (readonly)
            return <FormText label={label} value={value} layout={layout} />;

        return (
            <FormField
                label={label}
                fieldName={fieldName}
                validationResults={validationResults}
                value={value}
                layout={layout}
            >
                <Input
                    ref={node => {
                        if (focus) this.firstNameInput = node;
                    }}
                    disabled={disabled}
                    name={fieldName}
                    id={fieldName}
                    value={value}
                    onChange={this.onChange}
                    addonAfter={addonAfter}
                />
            </FormField>
        );
    }
}

export { FormInput };

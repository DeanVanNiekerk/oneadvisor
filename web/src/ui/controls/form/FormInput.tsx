import { Input } from 'antd';
import React, { Component, LegacyRef } from 'react';

import { ValidationResult } from '@/app/validation';

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
};

class FormInput extends Component<Props> {
    private firstNameInput: Input | null;

    componentDidMount() {
        if (this.firstNameInput) {
            setTimeout(() => {
                console.log('focus');
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
            focus
        } = this.props;

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

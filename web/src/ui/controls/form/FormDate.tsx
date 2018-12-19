import { DatePicker } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';

import { FormLayout } from './Form';
import { FormField } from './FormField';

type Props = {
    fieldName: string;
    label: string;
    value: string | null;
    disabled?: boolean;
    onChange?: (fieldName: string, value: any) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
};

class FormDate extends Component<Props> {
    onChange = (date: any, dateString: string) => {
        if (this.props.onChange)
            this.props.onChange(this.props.fieldName, dateString);
    };

    render() {
        const {
            fieldName,
            label,
            value,
            validationResults,
            disabled = false,
            layout
        } = this.props;

        return (
            <FormField
                label={label}
                fieldName={fieldName}
                validationResults={validationResults}
                value={value}
                layout={layout}
            >
                <DatePicker
                    disabled={disabled}
                    id={fieldName}
                    value={value ? moment(value) : undefined}
                    onChange={this.onChange}
                />
            </FormField>
        );
    }
}

export { FormDate };

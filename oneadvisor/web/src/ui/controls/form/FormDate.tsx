import { DatePicker } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';

import { DATE_FORMAT } from '@/app/utils';
import { ValidationResult } from '@/app/validation';

import { FormText } from './';
import { FormLayout } from './Form';
import { FormField } from './FormField';

type Props = {
    fieldName: string;
    label: string;
    extra?: React.ReactNode;
    value: string | null;
    disabled?: boolean;
    onChange?: (fieldName: string, value: any) => void;
    validationResults?: ValidationResult[];
    layout?: FormLayout;
    readonly?: boolean;
    hidden?: boolean;
};

class FormDate extends Component<Props> {
    onChange = (date: moment.Moment, dateString: string) => {
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
            layout,
            readonly,
            extra,
        } = this.props;

        if (readonly)
            return (
                <FormText
                    label={label}
                    value={value ? moment(value).format(DATE_FORMAT) : ""}
                    layout={layout}
                />
            );

        if (this.props.hidden) return <></>;

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
                    id={fieldName}
                    value={value ? moment(value) : undefined}
                    onChange={this.onChange}
                />
            </FormField>
        );
    }
}

export { FormDate };
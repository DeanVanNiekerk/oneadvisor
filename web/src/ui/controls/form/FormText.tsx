import React from 'react';

import { ValidationResult } from '@/app/validation';

import { FormLayout } from './Form';
import { FormField } from './FormField';

type Props = {
    label: string;
    value: string | React.ReactNode;
    fieldName?: string;
    layout?: FormLayout;
    loading?: boolean;
    validationResults?: ValidationResult[];
    extra?: React.ReactNode;
};

const FormText = (props: Props) => (
    <FormField
        label={props.label}
        layout={props.layout}
        loading={props.loading}
        fieldName={props.fieldName}
        validationResults={props.validationResults}
    >
        <span className="ant-form-text">{props.value}</span>
        <span style={{ float: 'right' }}>{props.extra}</span>
    </FormField>
);

export { FormText };

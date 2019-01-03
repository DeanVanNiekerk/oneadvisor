import React from 'react';

import { FormLayout } from './Form';
import { FormField } from './FormField';

type Props = {
    label: string;
    value: string;
    layout?: FormLayout;
    loading?: boolean;
};

const FormText = (props: Props) => (
    <FormField
        label={props.label}
        layout={props.layout}
        loading={props.loading}
    >
        <span className="ant-form-text">{props.value}</span>
    </FormField>
);

export { FormText };

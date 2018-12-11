import React from 'react';

import { FormLayout } from './Form';
import { FormField } from './FormField';

type Props = {
    label: string;
    value: string;
    layout?: FormLayout;
};

const FormText = (props: Props) => (
    <FormField label={props.label} layout={props.layout}>
        <span className="ant-form-text">{props.value}</span>
    </FormField>
);

export { FormText };

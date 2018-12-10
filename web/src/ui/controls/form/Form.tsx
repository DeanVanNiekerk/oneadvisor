import { Form as FormAD } from 'antd';
import React, { ReactNode } from 'react';



type Props = {
    children: ReactNode
};

const Form = (props: Props) => (
    <FormAD>{props.children}</FormAD>
);

export { Form };
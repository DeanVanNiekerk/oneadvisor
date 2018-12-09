

import React, { ReactNode } from 'react';
import { Form as FormAD } from 'antd';

type Props = {
    children: ReactNode
};

const Form = (props: Props) => (
    <FormAD>{props.children}</FormAD>
);

export { Form };
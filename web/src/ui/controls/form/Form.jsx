// @flow

import * as React from 'react';
import { Form as FormAD } from 'antd';

type Props = {
    children: React.Node
};

const Form = (props: Props) => (
    <FormAD>{props.children}</FormAD>
);

export { Form };
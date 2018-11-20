// @flow

import * as React from 'react';
import { Form as FormBS } from 'reactstrap';

type Props = {
    children: React.Node
};

const Form = (props: Props) => (
    <FormBS className="p-3">{props.children}</FormBS>
);

export { Form };
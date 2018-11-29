// @flow

import * as React from 'react';
import { Card as CardAD } from 'antd';

type Props = {
    children: React.Node,
};

const Card = (props: Props) => (
    <CardAD
        { ...props }
    >
        {props.children}
    </CardAD>
);

export { Card };
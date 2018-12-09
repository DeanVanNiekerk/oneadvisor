

import React, { ReactNode } from 'react';
import { Card as CardAD } from 'antd';

type Props = {
    children: ReactNode,
};

const Card = (props: Props) => (
    <CardAD
        { ...props }
    >
        {props.children}
    </CardAD>
);

export { Card };
import { Card as CardAD } from 'antd';
import React, { ReactNode } from 'react';



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
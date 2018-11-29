// @flow

import * as React from 'react';
import { Button as ButtonAD } from 'antd';

type Props = {
    children: React.Node
};

const Button = (props: Props) => (
    <ButtonAD
        style={{
            marginLeft: 8
        }}
        { ...props }
    >
        {props.children}
    </ButtonAD>
);

export { Button };
import { Button as ButtonAD } from 'antd';
import { ButtonType } from 'antd/lib/button';
import React, { ReactNode } from 'react';



type Props = {
    type?: ButtonType,
    icon?: string,
    disabled?: boolean,
    onClick: () => void,
    children: ReactNode
};

const Button = (props: Props) => (
    <ButtonAD
        style={{
            marginLeft: 8
        }}
        type={props.type}
        icon={props.icon}
        onClick={props.onClick}
        disabled={props.disabled || false}
    >
        {props.children}
    </ButtonAD>
);

export { Button };
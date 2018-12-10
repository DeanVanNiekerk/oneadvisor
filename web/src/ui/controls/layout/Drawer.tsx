import { Drawer as DrawerAD } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
    title: string,
    children: ReactNode,
    visible: boolean,
    onClose: () => void,
    maskClosable?: boolean,
    width?: number,
    hasTabs?: boolean
};

const Drawer = (props: Props) => (
    <DrawerAD
        title={props.title}
        width={props.width}
        visible={props.visible}
        onClose={props.onClose}
        maskClosable={props.maskClosable}
        style={{
            height: 'calc(100% - 55px)',
            overflow: 'auto',
            paddingBottom: 53,
            paddingTop: props.hasTabs ? 10 : 24
        }}
    >
        {props.children}
    </DrawerAD>
);
Drawer.defaultProps = {
    visible: false,
    width: 720,
    maskClosable: false,
    hasTabs: false
}

export { Drawer };
// @flow

import * as React from 'react';
import { Drawer as DrawerAD } from 'antd';

type Props = {
    title: string,
    children: React.Node,
    visible: boolean,
    onClose: () => void,
    maskClosable: boolean,
    width: number
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
            paddingBottom: 53
        }}
    >
        {props.children}
    </DrawerAD>
);
Drawer.defaultProps = {
    visible: false,
    width: 720,
    maskClosable: false
}

export { Drawer };
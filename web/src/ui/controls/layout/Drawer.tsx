import { Drawer as DrawerAD } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
    title: string;
    children: ReactNode;
    visible: boolean;
    onClose: () => void;
    maskClosable?: boolean;
    width?: number | string;
    noTopPadding?: boolean;
};

const Drawer = (props: Props) => {
    return (
        <DrawerAD
            title={props.title}
            width={props.width}
            visible={props.visible}
            onClose={props.onClose}
            maskClosable={props.maskClosable}
            destroyOnClose={true}
            style={{
                height: 'calc(100% - 65px)',
                overflow: 'auto',
                paddingBottom: 53,
                paddingTop: props.noTopPadding ? 0 : 24
            }}
        >
            {props.children}
        </DrawerAD>
    );
};
Drawer.defaultProps = {
    visible: false,
    //width: '45%',
    width: '800px',
    maskClosable: true,
    noTopPadding: false
};

export { Drawer };

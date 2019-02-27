import { Drawer as DrawerAD, Icon } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
    title: string;
    icon?: string;
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
            title={
                <span>
                    {props.icon && (
                        <Icon
                            type={props.icon}
                            style={{ marginRight: '8px' }}
                        />
                    )}
                    {props.title}
                </span>
            }
            width={props.width}
            visible={props.visible}
            onClose={props.onClose}
            maskClosable={props.maskClosable}
            destroyOnClose={true}
            bodyStyle={{
                height: 'calc(100% - 65px)',
                overflow: 'auto',
                paddingBottom: 53,
                paddingTop: props.noTopPadding ? 8 : 24
            }}
        >
            {props.children}
        </DrawerAD>
    );
};
Drawer.defaultProps = {
    visible: false,
    //width: '45%',
    width: '900px',
    maskClosable: true,
    noTopPadding: false
};

export { Drawer };

import { Drawer as DrawerAD, Icon } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
    title: string;
    icon?: string | ReactNode;
    children: ReactNode;
    visible: boolean;
    onClose: () => void;
    maskClosable?: boolean;
    width?: number | string;
    noTopPadding?: boolean;
};

const Drawer = (props: Props) => {
    let icon: ReactNode = <span />;

    if (props.icon) {
        if (typeof props.icon === "string") {
            icon = <Icon type={props.icon} />;
        } else {
            icon = props.icon;
        }
    }

    return (
        <DrawerAD
            title={
                <span>
                    {icon}
                    <span style={{ marginLeft: "8px" }}>{props.title}</span>
                </span>
            }
            width={props.width}
            visible={props.visible}
            onClose={props.onClose}
            maskClosable={props.maskClosable}
            destroyOnClose={true}
            bodyStyle={{
                height: "calc(100% - 65px)",
                overflow: "auto",
                paddingBottom: 53,
                paddingTop: props.noTopPadding ? 0 : 24,
            }}
        >
            {props.children}
        </DrawerAD>
    );
};
Drawer.defaultProps = {
    visible: false,
    //width: '45%',
    width: "900px",
    maskClosable: true,
    noTopPadding: false,
};

export { Drawer };

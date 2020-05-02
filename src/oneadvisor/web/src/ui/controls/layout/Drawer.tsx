import { Drawer as DrawerAD } from "antd";
import React, { ReactNode } from "react";

import { IconName } from "@/app/types";

import { Icon } from "../common/Icon";

type Props = {
    title: string | ReactNode;
    iconName?: IconName;
    icon?: ReactNode;
    children: ReactNode;
    visible: boolean;
    onClose: () => void;
    maskClosable?: boolean;
    width?: number | string;
    noTopPadding?: boolean;
    footer: ReactNode;
    bodyStyle?: React.CSSProperties;
};

const Drawer: React.FC<Props> = (props: Props) => {
    let bodyStyle: React.CSSProperties = {
        paddingTop: props.noTopPadding ? 0 : 24,
    };

    if (props.bodyStyle) {
        bodyStyle = {
            ...props.bodyStyle,
        };
    }

    return (
        <DrawerAD
            title={
                <span>
                    {props.iconName && <Icon name={props.iconName} />}
                    {props.icon && props.icon}
                    <span style={{ marginLeft: "8px" }}>{props.title}</span>
                </span>
            }
            width={props.width}
            visible={props.visible}
            onClose={props.onClose}
            maskClosable={props.maskClosable}
            destroyOnClose={true}
            bodyStyle={bodyStyle}
            footer={props.footer}
            footerStyle={{ textAlign: "right" }}
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

import { Tabs as TabsAD } from "antd";
import { TabsPosition, TabsType } from "antd/lib/tabs";
import React, { ReactNode } from "react";

type Props = {
    activeKey: string;
    onChange: (activeKey: string) => void;
    sticky?: boolean;
    children: ReactNode;
    tabPosition?: TabsPosition;
    tabBarExtraContent?: React.ReactNode | null;
    size?: "large" | "default" | "small";
    type?: TabsType;
    tabBarGutter?: number | undefined;
    clearTabsTopPadding?: boolean | undefined;
};

const Tabs: React.FC<Props> = (props: Props) => {
    let style = {};

    let tabBarStyle: React.CSSProperties = {
        backgroundColor: "#1f1f1f",
        zIndex: 1,
    };

    if (props.sticky) {
        style = {
            ...style,
            overflow: "inherit",
        };

        tabBarStyle = {
            ...tabBarStyle,
            position: "sticky",
            top: 0,
        };
    }

    let className = "";
    if (props.clearTabsTopPadding) className = "clearTabsTopPadding";

    return (
        <TabsAD
            animated={false}
            type={props.type}
            onChange={props.onChange}
            activeKey={props.activeKey}
            tabBarStyle={tabBarStyle}
            style={style}
            tabPosition={props.tabPosition}
            tabBarExtraContent={props.tabBarExtraContent}
            size={props.size}
            tabBarGutter={props.tabBarGutter}
            className={className}
            destroyInactiveTabPane={true}
        >
            {props.children}
        </TabsAD>
    );
};
Tabs.defaultProps = {
    sticky: false,
};

export { Tabs };

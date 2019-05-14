import { Tabs as TabsAD } from 'antd';
import { TabsPosition, TabsType } from 'antd/lib/tabs';
import React, { ReactNode } from 'react';

type Props = {
    activeKey: string;
    onChange: (activeKey: string) => void;
    sticky: boolean;
    children: ReactNode;
    tabPosition?: TabsPosition;
    tabBarExtraContent?: React.ReactNode | null;
    size?: 'large' | 'default' | 'small';
    type?: TabsType;
};

const Tabs = (props: Props) => {
    let style = {};

    let tabBarStyle: any = {
        backgroundColor: '#FFF',
        zIndex: 1
    };

    if (props.sticky) {
        style = {
            ...style,
            overflow: 'inherit'
        };

        tabBarStyle = {
            ...tabBarStyle,
            position: 'sticky',
            top: 0
        };
    }

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
        >
            {props.children}
        </TabsAD>
    );
};
Tabs.defaultProps = {
    sticky: false
};

export { Tabs };

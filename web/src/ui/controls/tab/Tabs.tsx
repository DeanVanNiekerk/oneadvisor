import { Tabs as TabsAD } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
    activeKey: string;
    onChange: (activeKey: string) => void;
    sticky: boolean;
    children: ReactNode;
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
            //type="card"
            onChange={props.onChange}
            activeKey={props.activeKey}
            tabBarStyle={tabBarStyle}
            style={style}
        >
            {props.children}
        </TabsAD>
    );
};
Tabs.defaultProps = {
    sticky: false
};

export { Tabs };

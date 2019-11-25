import { Layout as LayoutAD } from "antd";
import React, { ReactNode } from "react";

import Navigator from "./Navigator";
import SideMenu from "./SideMenu";

const { Content } = LayoutAD;

type Props = {
    children: ReactNode;
};

const Layout: React.FC<Props> = (props: Props) => {
    return (
        <LayoutAD
            style={{
                height: "100%",
            }}
        >
            <Navigator />
            <LayoutAD>
                <SideMenu />
                <LayoutAD>
                    <Content
                        style={{
                            background: "#fff",
                            padding: 15,
                            paddingTop: 0,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        {props.children}
                    </Content>
                </LayoutAD>
            </LayoutAD>
        </LayoutAD>
    );
};

export default Layout;

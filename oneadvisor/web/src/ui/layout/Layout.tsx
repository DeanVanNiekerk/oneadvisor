import { Layout } from "antd";
import React, { ReactNode } from "react";

import Navigator from "./Navigator";
import SideMenu from "./SideMenu";

const { Content } = Layout;

type Props = {
    children: ReactNode;
};

const LayoutContainer: React.FC<Props> = (props: Props) => {
    return (
        <Layout
            style={{
                height: "100%",
            }}
        >
            <Navigator />
            <Layout>
                <SideMenu />
                <Layout>
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
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LayoutContainer;

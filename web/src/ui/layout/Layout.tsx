import { Layout } from 'antd';
import React, { ReactNode } from 'react';

import Navigator from './Navigator';
import SideMenu from './SideMenu';

const { Content } = Layout;

type Props = {
    children: ReactNode;
};

class LayoutContainer extends React.Component<Props> {
    render() {
        return (
            <Layout
                tagName="section"
                style={{
                    height: "100%",
                }}
            >
                <Navigator />
                <Layout tagName="section">
                    <SideMenu />
                    <Layout tagName="section">
                        <Content
                            tagName="main"
                            style={{
                                background: "#fff",
                                padding: 15,
                                paddingTop: 0,
                                margin: 0,
                                minHeight: 280,
                            }}
                        >
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}

export default LayoutContainer;

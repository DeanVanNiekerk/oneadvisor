

import React, { ReactNode } from 'react';
import { Layout } from 'antd';

import Navigator from './Navigator';
import SideMenu from './SideMenu';

const { Content } = Layout;

type Props = {
    onLogout: Function,
    children: ReactNode
};

class LayoutContainer extends React.Component<Props> {
    render() {
        return (
            <Layout
                style={{
                    height: "100%"
                }}>
                <Navigator onLogout={this.props.onLogout} />
                <Layout>
                    <SideMenu  />
                    <Layout>
                        <Content
                            style={{
                                background: '#fff',
                                padding: 15,
                                margin: 0,
                                minHeight: 280
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

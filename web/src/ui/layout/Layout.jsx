// @flow

import React, { Component } from 'react';
import { Layout } from 'antd';

import Navigator from './Navigator';
import SideMenu from './SideMenu';

const { Content } = Layout;

type Props = {
    onLogout: Function,
    children: any[]
};

class LayoutContainer extends Component<Props> {
    render() {
        return (
            <Layout
                style={{
                    height: "100%"
                }}>
                <Navigator onLogout={this.props.onLogout} />
                <Layout>
                    <SideMenu />
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Content
                            style={{
                                background: '#fff',
                                padding: 24,
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

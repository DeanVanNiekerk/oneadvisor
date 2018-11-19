// @flow

import React, { Component } from 'react';
import styled from 'styled-components';

import Navigator from './Navigator';
import SideMenu from './SideMenu';
import PageHeader from './PageHeader';
import Body from './Body';

type Props = {
    onLogout: Function,
    children: any[]
};

class Layout extends Component<Props> {
    render() {
        return (
            <>
                <Navigator onLogout={this.props.onLogout} />

                <div className="container-fluid p-0">
                    <div class="row flex-xl-nowrap no-gutters">
                        <SideMenu />

                        <main class="col-9 blue" role="main">
                            <PageHeader />
                            {this.props.children}
                        </main>
                    </div>
                </div>
            </>
        );
    }
}

export default Layout;

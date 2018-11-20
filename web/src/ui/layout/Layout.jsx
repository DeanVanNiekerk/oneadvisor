// @flow

import React, { Component } from 'react';
import styled from 'styled-components';

import Navigator from './Navigator';
import SideMenu from './SideMenu';

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
                    <div className="row flex-xl-nowrap no-gutters">
                        <SideMenu />
                        <main className="col-9" role="main">
                            {this.props.children}
                        </main>
                    </div>
                </div>
            </>
        );
    }
}

export default Layout;

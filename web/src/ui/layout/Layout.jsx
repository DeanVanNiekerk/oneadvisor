// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';

import Navigator from './Navigator';
import SideMenu from './SideMenu';
import PageHeader from './PageHeader';
import Body from './Body';
import { theme } from 'ui/theme/theme';

const Root = styled.div`
    display: flex;
`;

type Props = {
    onLogout: Function,
    children: any[]
};

class Layout extends Component<Props> {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Root>
                    <CssBaseline />
                    <Navigator onLogout={this.props.onLogout} />
                    <SideMenu />
                    <Body>{this.props.children}</Body>
                </Root>
            </MuiThemeProvider>
        );
    }
}

export default Layout;

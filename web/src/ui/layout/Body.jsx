// @flow

import * as React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import PageHeader from './PageHeader';

const Main = styled(Typography)`
    flex-grow: 1 !important;
`;

type Props = {
    children: React.Node
};

class Body extends React.Component<Props> {
    render() {
        return (
            <Main variant="body1" component="main">
                <AppBar position="static">
                    <Toolbar />
                </AppBar>
                <PageHeader />
                {this.props.children}
            </Main>
        );
    }
}

export default Body;

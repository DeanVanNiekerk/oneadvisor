// @flow

import * as React from 'react';
import styled from 'styled-components';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const Main = styled.div`
    flex-grow: 1 !important;
`;

type Props = {
    children: React.Node
};

class Body extends React.Component<Props> {
    render() {
        return (
            <Main>
                <AppBar position="static">
                    <Toolbar />
                </AppBar>
                {this.props.children}
            </Main>
        );
    }
}

export default Body;

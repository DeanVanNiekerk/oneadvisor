import React, { Component } from 'react';
import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const Main = styled.div`
    flex-grow: 1 !important;
   
`
class Body extends Component {

    render() {

        return (
            <Main theme={this.props.theme}>
                <AppBar position="static"><Toolbar /></AppBar>
                {this.props.children}
            </Main>
        )
    }

}

export default withTheme()(Body);

// padding: ${props => props.theme.spacing.unit * 3}px;




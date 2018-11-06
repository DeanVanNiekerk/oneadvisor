// @flow

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import Icon from '@material-ui/core/Icon';
import { withTheme } from '@material-ui/core/styles';

import type { Theme } from '@material-ui/core/styles/createMuiTheme';

import AppBarMUI from '@material-ui/core/AppBar';
import ToolbarMUI from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import type { State as RootState } from 'state/rootReducer';
import type { Application } from 'state/context/types';

import {
    applicationsSelector,
    currentApplicationSelector
} from 'state/context/selectors';

type ThemeProps = {
    theme: Theme
};

const AppBar = styled(AppBarMUI)`
    z-index: ${(props: ThemeProps) => props.theme.zIndex.drawer + 1} !important;
    border-bottom: 4px solid ${props => props.application.color};
`;

const Toolbar = styled(ToolbarMUI)`
    align-items: normal !important;
`;

const ToolbarItem = styled.div`
    display: flex;
    min-height: 0px;
    width: 145px;
    align-items: center;
    justify-content: center;
    font-family: ${(props: ThemeProps) => props.theme.typography.fontFamily};
    font-weight: ${(props: ThemeProps) =>
        props.theme.typography.fontWeightMedium};
    text-transform: uppercase;
`;

const Header = styled(ToolbarItem)`
    justify-content: left;
    width: 215px;
    font-size: 1.6rem;
`;

const Light = styled.span`
    font-weight: 100;
`;

const Bold = styled.span`
    font-weight: 800;
`;

const NavItem = styled(ToolbarItem)`
    cursor: pointer;
    ${props =>
        props.application.isCurrent &&
        css`
            background-color: ${props.application.color};
        `};
`;

const NavItemText = styled.span`
    padding-left: 5px;
`;

type Props = {
    onLogout: Function,
    applications: Application[],
    currentApplication: Application,
    theme: Theme,
    history: Object
};

class Navigator extends Component<Props> {
    navigate(to) {
        this.props.history.push(to);
    }

    render() {
        return (
            <AppBar
                position="fixed"
                application={this.props.currentApplication}
                theme={this.props.theme}
            >
                <Toolbar>
                    <Header theme={this.props.theme}>
                        <Bold>One</Bold>
                        <Light>Advisor</Light>
                    </Header>
                    {this.props.applications.map(app => (
                        <NavItem
                            key={app.id}
                            application={app}
                            theme={this.props.theme}
                            onClick={() => this.navigate(app.relativePath)}
                        >
                            <Icon>{app.icon}</Icon>
                            <NavItemText>{app.name}</NavItemText>
                        </NavItem>
                    ))}
                    {/* <Button color="inherit">Signout</Button> */}
                </Toolbar>
            </AppBar>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    applications: applicationsSelector(state),
    currentApplication: currentApplicationSelector(state) || {}
});

export default connect(mapStateToProps)(withTheme()(withRouter(Navigator)));

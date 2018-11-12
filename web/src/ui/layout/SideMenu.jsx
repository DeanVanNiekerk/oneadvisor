// @flow

import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Icon from '@material-ui/core/Icon';
import DrawerMUI from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import ListMUI from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AppBar from '@material-ui/core/AppBar';
import ListSubheader from '@material-ui/core/ListSubheader';

import config from '@/config/config';
import type { State as RootState } from '@/state/rootReducer';
import type { Menu, MenuLink, Application } from '@/state/context/types';
import {
    currentMenuSelector,
    currentApplicationSelector
} from '@/state/context/selectors';

const drawerWidth = config.ui.sideBarWidth;

const Drawer = styled(DrawerMUI)`
    width: ${drawerWidth}px !important;
    flex-shrink: 0 !important;

    & > div {
        width: ${drawerWidth}px !important;
    }
`;

const List = styled(ListMUI)`
    margin-top:5px !important;
`;

type Props = {
    className: string,
    menu: Menu,
    application: Application
};

class SideMenu extends Component<Props> {
    render() {
        return (
            <Drawer variant="permanent">
                <AppBar position="static">
                    <Toolbar />
                </AppBar>

                {this.props.menu.groups.map(group => {
                    return (
                        <List
                            key={group.name}
                            subheader={
                                <ListSubheader>{group.name}</ListSubheader>
                            }
                        >
                            {group.links.map(link => {
                                return (
                                    <ListItemLink
                                        key={link.relativePath}
                                        link={link}
                                        menu={this.props.menu}
                                        application={this.props.application}
                                    />
                                );
                            })}
                        </List>
                    );
                })}
            </Drawer>
        );
    }
}

const ListItemContext = styled.li`
    ${props =>
        props.link.isCurrent &&
        css`
            border-left: 6px solid ${props => props.application.color};
        `} ${props =>
        !props.link.isCurrent &&
        css`
            border-left: 6px solid transparent;
        `};
`;

type ListItemLinkProps = {
    link: MenuLink,
    menu: Menu,
    application: Application
};

class ListItemLink extends React.Component<ListItemLinkProps> {
    renderLink = itemProps => (
        <Link
            to={`${this.props.menu.relativePath}${
                this.props.link.relativePath
            }`}
            {...itemProps}
        />
    );

    render() {
        const { link, application } = this.props;
        return (
            <ListItemContext link={link} application={application}>
                <ListItem
                    button
                    component={this.renderLink}
                    selected={link.isCurrent}
                >
                    <ListItemIcon>
                        <Icon>{link.icon}</Icon>
                    </ListItemIcon>
                    <ListItemText primary={link.name} />
                </ListItem>
            </ListItemContext>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    menu: currentMenuSelector(state),
    application: currentApplicationSelector(state)
});

export default connect(mapStateToProps)(SideMenu);

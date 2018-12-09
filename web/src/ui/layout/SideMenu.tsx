

import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Menu as MenuAD, Icon } from 'antd';

import { State as RootState } from '@/state/rootReducer';
import { Menu, MenuLink, Application } from '@/state/context/types';
import {
    currentMenuSelector,
    currentApplicationSelector
} from '@/state/context/selectors';

const { SubMenu, Item } = MenuAD;
const { Sider } = Layout;

type MenuItemProps = {
    link: MenuLink,
    application: Application
}

const MenuItem = styled(Item)`
    ${(props: MenuItemProps) =>
        props.link.isCurrent &&
        css`
            background-color: ${(props: MenuItemProps) => props.application.color} !important;
        `}
`;

type Props = {
    menu: Menu,
    application: Application
};

class SideMenu extends Component<Props> {
    render() {
        return (
            <Sider width={225} style={{ background: '#fff' }}>
                <MenuAD
                    theme="dark"
                    mode="inline"
                    defaultOpenKeys={this.props.menu.groups.map(g => g.name)}
                    style={{ height: '100%', borderRight: 0 }}
                >
                    {this.props.menu.groups.map(group => (
                        <SubMenu
                            key={group.name}
                            title={<span>{group.name}</span>}
                        >
                            {group.links.map(link => (
                                <MenuItem
                                    key={link.relativePath}
                                    link={link}
                                    application={this.props.application}
                                >
                                    <Link
                                        to={`${this.props.menu.relativePath}${link.relativePath}`}
                                    >
                                        <span>
                                            <Icon type={link.icon} />
                                            <span>{link.name}</span>
                                        </span>
                                    </Link>
                                </MenuItem>
                            ))}
                        </SubMenu>
                    ))}
                </MenuAD>
            </Sider>
          
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    menu: currentMenuSelector(state),
    application: currentApplicationSelector(state)
});

export default connect(mapStateToProps)(SideMenu);

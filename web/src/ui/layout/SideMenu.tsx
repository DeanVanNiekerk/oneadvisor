import { Icon, Layout, Menu as MenuAD } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { hasUseCases, hasUseCasesMenuGroup } from '@/app/identity';
import { allGroupNames } from '@/config/menu';
import { identitySelector } from '@/state/app/directory/identity';
import { currentApplicationSelector, currentMenuSelector } from '@/state/context/selectors';
import { Application, Menu, MenuLink } from '@/state/context/types';
import { RootState } from '@/state/rootReducer';

const { SubMenu, Item } = MenuAD;
const { Sider } = Layout;

type MenuItemProps = {
    link: MenuLink;
    application: Application;
};

const MenuItem = styled(Item)`
    ${(props: MenuItemProps) =>
        props.link.isCurrent &&
        css`
            background-color: ${(props: MenuItemProps) =>
                props.application.color} !important;
        `}
`;

type Props = {
    menu: Menu;
    application: Application;
    useCases: string[];
};

class SideMenu extends Component<Props> {
    render() {
        return (
            <Sider width={225} style={{ background: '#fff' }}>
                <MenuAD
                    theme="dark"
                    mode="inline"
                    defaultOpenKeys={allGroupNames()}
                    style={{ height: '100%', borderRight: 0 }}
                >
                    {this.props.menu.groups
                        .filter(group =>
                            hasUseCasesMenuGroup(group, this.props.useCases)
                        )
                        .map(group => (
                            <SubMenu
                                key={group.name}
                                title={<span>{group.name}</span>}
                            >
                                {group.links
                                    .filter(link =>
                                        hasUseCases(
                                            link.useCases,
                                            this.props.useCases
                                        )
                                    )
                                    .map(link => (
                                        <MenuItem
                                            key={link.relativePath}
                                            link={link}
                                            application={this.props.application}
                                        >
                                            <Link
                                                to={`${
                                                    this.props.menu.relativePath
                                                }${link.relativePath}`}
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

const mapStateToProps = (state: RootState) => {
    const identityState = identitySelector(state);
    return {
        menu: currentMenuSelector(state),
        application: currentApplicationSelector(state),
        useCases: identityState.identity
            ? identityState.identity.useCaseIds
            : []
    };
};

export default connect(mapStateToProps)(SideMenu);

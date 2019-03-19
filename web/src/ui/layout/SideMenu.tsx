import { Icon, Layout, Menu as MenuAD } from 'antd';
import React, { Component, CSSProperties } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { hasUseCases, hasUseCasesMenuGroup } from '@/app/identity';
import { allGroupNames } from '@/config/menu';
import { useCaseSelector } from '@/state/auth';
import { currentApplicationSelector, currentMenuSelector } from '@/state/context/selectors';
import { Application, Menu, MenuLink } from '@/state/context/types';
import { RootState } from '@/state/rootReducer';

const { SubMenu, Item } = MenuAD;
const { Sider } = Layout;

type Props = {
    menu: Menu;
    application: Application;
    useCases: string[];
};

class SideMenu extends Component<Props> {
    getMenuItemStyle = (
        link: MenuLink,
        application: Application
    ): CSSProperties => {
        if (!link.isCurrent) return {};
        return {
            backgroundColor: `${application.color}`,
        };
    };

    render() {
        return (
            <Sider width={225} style={{ background: "#fff" }}>
                <MenuAD
                    theme="dark"
                    mode="inline"
                    defaultOpenKeys={allGroupNames()}
                    style={{ height: "100%", borderRight: 0 }}
                    selectedKeys={[]}
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
                                        <Item
                                            key={link.relativePath}
                                            style={this.getMenuItemStyle(
                                                link,
                                                this.props.application
                                            )}
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
                                        </Item>
                                    ))}
                            </SubMenu>
                        ))}
                </MenuAD>
            </Sider>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    return {
        menu: currentMenuSelector(state),
        application: currentApplicationSelector(state),
        useCases: useCaseSelector(state),
    };
};

export default connect(mapStateToProps)(SideMenu);

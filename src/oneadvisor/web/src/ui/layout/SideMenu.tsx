import { Layout, Menu as MenuAD } from "antd";
import React, { Component, CSSProperties } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { hasPermissionsMenuGroup, hasRoles, hasUseCases } from "@/app/identity";
import { defaultOpenGroupNames } from "@/config/menu";
import { RootState } from "@/state";
import { roleSelector, useCaseSelector } from "@/state/auth";
import { currentMenuSelector, currentRootNavigationItemSelector } from "@/state/context/selectors";
import { Menu, MenuLink, RootNavigationItem } from "@/state/context/types";
import { Icon } from "@/ui/controls/common/Icon";

const { SubMenu, Item } = MenuAD;
const { Sider } = Layout;

type Props = {
    menu: Menu;
    rootNavigationItem: RootNavigationItem;
    useCases: string[];
    roles: string[];
};

type State = {
    collapsed: boolean;
};

class SideMenu extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: false,
        };
    }

    onCollapse = (collapsed) => {
        this.setState({ collapsed });
    };

    getMenuItemStyle = (link: MenuLink, item: RootNavigationItem): CSSProperties => {
        if (!link.isCurrent) return {};
        return {
            backgroundColor: `${item.color}`,
        };
    };

    render() {
        return (
            <Sider
                collapsible
                collapsed={this.state.collapsed}
                onCollapse={this.onCollapse}
                width={225}
                style={{ background: "#fff" }}
            >
                <MenuAD
                    theme="dark"
                    mode="inline"
                    defaultOpenKeys={defaultOpenGroupNames()}
                    style={{ height: "100%", borderRight: 0 }}
                    selectedKeys={[]}
                >
                    {this.props.menu.groups
                        .filter((group) =>
                            hasPermissionsMenuGroup(group, this.props.useCases, this.props.roles)
                        )
                        .map((group) => (
                            <SubMenu
                                key={group.name}
                                title={
                                    <span>
                                        <Icon name={group.icon} />
                                        <span>{group.name}</span>
                                    </span>
                                }
                            >
                                {group.links
                                    .filter(
                                        (link) =>
                                            hasUseCases(link.useCases, this.props.useCases) &&
                                            hasRoles(link.roles, this.props.roles)
                                    )
                                    .map((link) => (
                                        <Item
                                            key={link.relativePath}
                                            style={this.getMenuItemStyle(
                                                link,
                                                this.props.rootNavigationItem
                                            )}
                                        >
                                            <Link
                                                to={`${this.props.menu.relativePath}${link.relativePath}`}
                                            >
                                                <span>{link.name}</span>
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
        rootNavigationItem: currentRootNavigationItemSelector(state),
        useCases: useCaseSelector(state),
        roles: roleSelector(state),
    };
};

export default connect(mapStateToProps)(SideMenu);

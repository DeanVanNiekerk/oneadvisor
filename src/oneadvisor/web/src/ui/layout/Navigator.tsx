import { Layout, Menu, Popover, Tag } from "antd";
import React, { Component, CSSProperties } from "react";
import { connect, DispatchProp } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";

import { hasPermissionsMenuGroups } from "@/app/identity";
import config from "@/config/config";
import { RootState } from "@/state";
import { roleSelector, signOut, useCaseSelector } from "@/state/auth";
import {
    contextSelector,
    currentRootNavigationItemSelector,
    menusSelector,
    rootNavigationItemsSelector,
} from "@/state/context/selectors";
import { AppInfo, Menus, RootNavigationItem } from "@/state/context/types";

import { Icon, IdentityStatus } from "../controls";

const { Header } = Layout;
const { Item } = Menu;

const appNameStyle: CSSProperties = {
    fontSize: "20px",
    width: "175px",
    height: "31px",
    float: "left",
    color: "#ffffff",
};

const signoutStyle: CSSProperties = {
    fontSize: "14px",
    height: "31px",
    float: "right",
    color: "#ffffff",
    zIndex: 12,
    cursor: "pointer",
};

type Props = {
    menus: Menus;
    rootNavigationItems: RootNavigationItem[];
    currentRootNavigationItem: RootNavigationItem;
    useCases: string[];
    roles: string[];
    appInfo: AppInfo;
} & RouteComponentProps &
    DispatchProp;
class Navigator extends Component<Props> {
    navigate(to: string) {
        this.props.history.push(to);
    }

    signOut = () => {
        this.props.dispatch(signOut());
    };

    getEnvironmentColor = (): string => {
        switch (config.environment) {
            case "development":
                return "#6461A0";
            case "staging":
                return "#E84855";
            default:
                return "#48A9A6";
        }
    };

    getEnvironmentName = (): string => {
        const version = `v${this.props.appInfo ? this.props.appInfo.version : ""}`;
        switch (config.environment) {
            case "development":
                return "Dev";
            case "staging":
                return `Staging ${version}`;
            default:
                return `${version}`;
        }
    };

    getPinstripeStyle = (): CSSProperties => {
        return {
            width: "100%",
            height: "5px",
            backgroundColor: this.props.currentRootNavigationItem.color,
        };
    };

    getMenuItemStyle = (item: RootNavigationItem): CSSProperties => {
        if (!item.isCurrent) return {};
        return {
            backgroundColor: `${item.color}`,
        };
    };

    render() {
        return (
            <>
                <Header>
                    <Popover
                        placement="bottomRight"
                        content={<IdentityStatus />}
                        title="Profile"
                        mouseEnterDelay={1.5}
                    >
                        <div style={appNameStyle}>
                            <React.Fragment>
                                <span
                                    style={{
                                        fontWeight: 100,
                                    }}
                                >
                                    ONE
                                </span>
                                <span
                                    style={{
                                        fontWeight: 600,
                                    }}
                                >
                                    ADVISOR
                                </span>
                                <Tag
                                    style={{
                                        position: "absolute",
                                        top: "35px",
                                        left: "160px",
                                    }}
                                    color={this.getEnvironmentColor()}
                                >
                                    {this.getEnvironmentName()}
                                </Tag>
                            </React.Fragment>
                        </div>
                    </Popover>
                    <div style={signoutStyle} onClick={this.signOut}>
                        <span>Signout</span>
                    </div>
                    <Menu theme="dark" mode="horizontal" style={{ lineHeight: "64px" }}>
                        {this.props.rootNavigationItems
                            .filter((item) =>
                                hasPermissionsMenuGroups(
                                    this.props.menus[item.applicationId].groups,
                                    this.props.useCases,
                                    this.props.roles
                                )
                            )
                            .map((item) => (
                                <Item
                                    key={item.applicationId}
                                    style={this.getMenuItemStyle(item)}
                                    onClick={() => this.navigate(item.relativePath)}
                                >
                                    <Icon name={item.icon} style={{ fontSize: "16px" }} />
                                    {item.name}
                                </Item>
                            ))}
                    </Menu>
                </Header>
                <div style={this.getPinstripeStyle()} />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const contextState = contextSelector(state);

    return {
        menus: menusSelector(state),
        rootNavigationItems: rootNavigationItemsSelector(state),
        currentRootNavigationItem: currentRootNavigationItemSelector(state) || {},
        useCases: useCaseSelector(state),
        roles: roleSelector(state),
        appInfo: contextState.appInfo,
    };
};

export default connect(mapStateToProps)(withRouter(Navigator));

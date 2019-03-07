import { Icon, Layout, Menu, Popover, Tag } from 'antd';
import React, { Component, CSSProperties } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { hasUseCasesMenuGroups } from '@/app/identity';
import config from '@/config/config';
import { authSelector, signOut } from '@/state/auth';
import { applicationsSelector, currentApplicationSelector, menusSelector } from '@/state/context/selectors';
import { Application, Menus } from '@/state/context/types';
import { RootState } from '@/state/rootReducer';

import { IdentityStatus } from '../controls';

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
    applications: Application[];
    currentApplication: Application;
    useCases: string[];
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
                return "#000000";
        }
    };

    getEnvironmentName = (): string => {
        switch (config.environment) {
            case "development":
                return "Dev";
            case "staging":
                return "Staging";
            default:
                return "";
        }
    };

    getPinstripeStyle = (): CSSProperties => {
        return {
            width: "100%",
            height: "5px",
            backgroundColor: this.props.currentApplication.color,
        };
    };

    getMenuItemStyle = (application: Application): CSSProperties => {
        if (!application.isCurrent) return {};
        return {
            backgroundColor: `${application.color}`,
        };
    };

    render() {
        return (
            <>
                <Header className="header">
                    <div style={appNameStyle}>
                        <Popover
                            placement="bottomRight"
                            content={<IdentityStatus />}
                            title="My Profile"
                            mouseEnterDelay={1.5}
                        >
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
                            {config.environment !== "production" && (
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
                            )}
                        </Popover>
                    </div>
                    <div style={signoutStyle} onClick={this.signOut}>
                        Signout
                    </div>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ lineHeight: "64px" }}
                    >
                        {this.props.applications
                            .filter(app =>
                                hasUseCasesMenuGroups(
                                    this.props.menus[app.id].groups,
                                    this.props.useCases
                                )
                            )
                            .map(app => (
                                <Item
                                    key={app.id}
                                    style={this.getMenuItemStyle(app)}
                                    onClick={() =>
                                        this.navigate(app.relativePath)
                                    }
                                >
                                    <Icon
                                        type={app.icon}
                                        style={{ fontSize: "16px" }}
                                    />
                                    {app.name} {app.isCurrent.toString()}
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
    const authState = authSelector(state);

    return {
        menus: menusSelector(state),
        applications: applicationsSelector(state),
        currentApplication: currentApplicationSelector(state) || {},
        useCases: authState.identity ? authState.identity.useCaseIds : [],
    };
};

export default connect(mapStateToProps)(withRouter(Navigator));

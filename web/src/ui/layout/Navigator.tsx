import { Icon, Layout, Menu, Popover, Tag } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { hasUseCasesMenuGroups } from '@/app/identity';
import config from '@/config/config';
import { authSelector, signOut } from '@/state/auth';
import { applicationsSelector, currentApplicationSelector, menusSelector } from '@/state/context/selectors';
import { Application, Menus } from '@/state/context/types';
import { RootState } from '@/state/rootReducer';

import { IdentityStatus } from '../controls';

const { Header } = Layout;
const { Item } = Menu;

type MenuItemProps = {
    application: Application;
    onClick: () => void;
};

const MenuItem = styled(Item)`
    ${(props: MenuItemProps) =>
        props.application.isCurrent &&
        css`
            background-color: ${props.application.color} !important;
        `};
`;

type PinstripeProps = {
    application: Application;
};

const Pinstripe = styled.div`
    width: 100%;
    height: 5px;
    background-color: ${(props: PinstripeProps) => props.application.color};
`;

const AppName = styled.div`
    font-size: 20px;
    width: 175px;
    height: 31px;
    float: left;
    color: #ffffff;
`;

const Signout = styled.div`
    font-size: 14px;
    height: 31px;
    float: right;
    color: #ffffff;
    z-index: 12;
    cursor: pointer;
`;

const Light = styled.span`
    font-weight: 100;
`;

const Bold = styled.span`
    font-weight: 600;
`;

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

    render() {
        return (
            <>
                <Header className="header">
                    <AppName>
                        <Popover
                            placement="bottomRight"
                            content={<IdentityStatus />}
                            title="My Profile"
                            mouseEnterDelay={1.5}
                        >
                            <Light>ONE</Light>
                            <Bold>ADVISOR</Bold>
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
                    </AppName>
                    <Signout onClick={this.signOut}>Signout</Signout>
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
                                <MenuItem
                                    key={app.id}
                                    application={app}
                                    onClick={() =>
                                        this.navigate(app.relativePath)
                                    }
                                >
                                    <Icon
                                        type={app.icon}
                                        style={{ fontSize: "16px" }}
                                    />
                                    {app.name}
                                </MenuItem>
                            ))}
                    </Menu>
                </Header>
                <Pinstripe application={this.props.currentApplication} />
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

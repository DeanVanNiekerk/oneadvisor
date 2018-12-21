import { Icon, Layout, Menu, Popover } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';

import { hasUseCasesMenuGroups } from '@/app/identity';
import { Identity, identitySelector } from '@/state/app/directory/identity';
import { userInfoSelector } from '@/state/auth';
import { UserInfo } from '@/state/auth/types';
import { applicationsSelector, currentApplicationSelector, menusSelector } from '@/state/context/selectors';
import { Application, Menus } from '@/state/context/types';
import { RootState } from '@/state/rootReducer';

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
    onLogout: Function;
    applications: Application[];
    currentApplication: Application;
    identity: Identity;
    useCases: string[];
    userInfo: UserInfo;
} & RouteComponentProps;
class Navigator extends Component<Props> {
    navigate(to: string) {
        this.props.history.push(to);
    }

    render() {
        const { identity, userInfo } = this.props;

        const content = (
            <div>
                <div>
                    <b>Name:</b>&nbsp;
                    {userInfo.name}
                </div>
                <div>
                    <b>Email:</b>&nbsp;
                    {userInfo.email}
                </div>
                <div>
                    <b>Organisation:</b>&nbsp;
                    {identity.organisationName}
                </div>
                <div>
                    <b>Branch:</b>&nbsp;
                    {identity.branchName}
                </div>
                <div>
                    <b>Roles:</b>&nbsp;
                    {identity.roleIds.join(', ')}
                </div>
                <div>
                    <b>Id:</b>&nbsp;
                    {identity.id}
                </div>
            </div>
        );

        return (
            <>
                <Header className="header">
                    <AppName>
                        <Popover
                            placement="bottomRight"
                            content={content}
                            title="My Profile"
                            mouseEnterDelay={1.5}
                        >
                            <Light>ONE</Light>
                            <Bold>ADVISOR</Bold>
                        </Popover>
                    </AppName>
                    <Signout onClick={() => this.props.onLogout()}>
                        Signout
                    </Signout>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ lineHeight: '64px' }}
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
                                        style={{ fontSize: '16px' }}
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
    const identityState = identitySelector(state);
    const userInfo = userInfoSelector(state);
    return {
        menus: menusSelector(state),
        applications: applicationsSelector(state),
        currentApplication: currentApplicationSelector(state) || {},
        identity: identityState.identity,
        userInfo: userInfo,
        useCases: identityState.identity
            ? identityState.identity.useCaseIds
            : []
    };
};

export default connect(mapStateToProps)(withRouter(Navigator));

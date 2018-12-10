import { Icon, Layout, Menu } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';

import {
    applicationsSelector, currentApplicationSelector
} from '@/state/context/selectors';
import { Application } from '@/state/context/types';
import { RootState } from '@/state/rootReducer';



const { Header } = Layout;
const { Item } = Menu;

type MenuItemProps = {
    application: Application,
    onClick: () => void
}

const MenuItem = styled(Item)`
    ${(props: MenuItemProps) =>
        props.application.isCurrent &&
        css`
            background-color: ${props.application.color} !important;
        `};
`;

type PinstripeProps = {
    application: Application
}

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
    color: #FFFFFF;
`;

const Light = styled.span`
    font-weight: 100;
`;

const Bold = styled.span`
    font-weight: 600;
`;

type Props = {
    onLogout: Function,
    applications: Application[],
    currentApplication: Application
} & RouteComponentProps;
class Navigator extends Component<Props> {

    navigate(to: string) {
        this.props.history.push(to);
    }

    render() {
        return (
            <>
                <Header className="header">
                    <AppName>
                        <Light>ONE</Light><Bold>ADVISOR</Bold>
                    </AppName>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ lineHeight: '64px' }}
                    >
                        {this.props.applications.map(app => (
                            <MenuItem
                                key={app.id}
                                application={app}
                                onClick={() => this.navigate(app.relativePath)}
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
   
            //<Button color="inherit" onClick={() => this.props.onLogout()}>Signout</Button>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    applications: applicationsSelector(state),
    currentApplication: currentApplicationSelector(state) || {}
});

export default connect(mapStateToProps)(withRouter(Navigator));

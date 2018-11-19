// @flow

import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { RouterProps } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import type { Application } from '@/state/context/types';

import {
    applicationsSelector,
    currentApplicationSelector
} from '@/state/context/selectors';

const Container = styled.div`
    position: sticky;
    top: 0;
    z-index: 1071;
`;

const Brand = styled.div`
    padding-left: 14px !important;
    align-self: stretch;
    display: flex;
    align-items: center;
`;

const NavItem = styled.div`
    flex: 0 0 9em;
    align-self: stretch;
    display: flex;
    align-items: center;
    padding: 0px 14px;
    cursor: pointer;
    ${props =>
        props.application.isCurrent &&
        css`
            background-color: ${props.application.color};
        `};
`;

const NavItemText = styled.span`
    font-size: 1.1rem;
    padding-left: 7px;
`;

const NavBar = styled.div`
    height: 4rem;
    border-bottom: 5px solid ${props => props.application.color};

    -webkit-box-shadow: 0px 1px 8px 0px rgba(36,36,36,0.71);
    -moz-box-shadow: 0px 1px 8px 0px rgba(36,36,36,0.71);
    box-shadow: 0px 1px 8px 0px rgba(36,36,36,0.71);
`;

type LocalProps = {
    onLogout: Function,
    applications: Application[],
    currentApplication: Application,
};
type Props = LocalProps & RouterProps;

class Navigator extends Component<Props> {
    navigate(to) {
        this.props.history.push(to);
    }

    render() {
        return (
            <Container className="container-fluid text-white bg-primary p-0">
                <NavBar className="row flex-xl-nowrap no-gutters align-items-stretch" application={this.props.currentApplication}>
                    <Brand className="col-3 h4 mb-0">
                        <span className="font-weight-bold">ONE</span>
                        <span className="font-weight-light">ADVISOR</span>
                    </Brand>
                    <div className="col-9">
                        <div className="row flex-xl-nowrap h-100 no-gutters">
                            {this.props.applications.map(app => (
                                <NavItem
                                    key={app.id}
                                    application={app}
                                    className="font-weight-light"
                                    onClick={() =>
                                        this.navigate(app.relativePath)
                                    }
                                >
                                    <FontAwesomeIcon icon={app.icon} />
                                    <NavItemText>{app.name}</NavItemText>
                                </NavItem>
                            ))}
                        </div>
                    </div>
                </NavBar>
            </Container>

            //<Button color="inherit" onClick={() => this.props.onLogout()}>Signout</Button>

        );
    }
}

const mapStateToProps = (state: RootState) => ({
    applications: applicationsSelector(state),
    currentApplication: currentApplicationSelector(state) || {}
});

export default connect(mapStateToProps)(withRouter(Navigator));

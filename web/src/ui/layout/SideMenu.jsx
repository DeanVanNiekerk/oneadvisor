// @flow

import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Nav, NavItem as NavItemBs } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import config from '@/config/config';
import type { State as RootState } from '@/state/rootReducer';
import type { Menu, MenuLink, Application } from '@/state/context/types';
import {
    currentMenuSelector,
    currentApplicationSelector
} from '@/state/context/selectors';

/*
FIXED WIDTH SIDE BAR
@media (min-width: 1200px) {
    .bd-sidebar {
        -ms-flex: 0 1 320px;
        flex: 0 1 320px;
    }
} */

const Container = styled.div`
    -ms-flex-order: 0;
    order: 0;
    background-color: #f0f0f0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 4rem;
    z-index: 1000;
    height: calc(100vh - 4rem);
`;

const Links = styled.div`
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
`;

const Section = styled.div`
    padding: 12px 10px;
`;

const NavItem = styled(NavItemBs)`
    ${props =>
        props.link.isCurrent &&
        css`
            background-color: #d4d4d4;
            border-left: 6px solid ${props => props.application.color};
        `}
    ${props =>
        !props.link.isCurrent &&
        css`
            border-left: 6px solid #f0f0f0;
        `}
`;

const Icon = styled(FontAwesomeIcon)`
    margin-top: 10px;
    font-size: 1.1rem;
`;

type Props = {
    className: string,
    menu: Menu,
    application: Application
};

class SideMenu extends Component<Props> {
    render() {
        return (
            <Container className="col-3">
                <Links>
                    {this.props.menu.groups.map(group => {
                        return (
                            <div key={group.name}>
                                <Section className="text-uppercase">
                                    {group.name}
                                </Section>
                                <Nav className="flex-column">
                                    {group.links.map(link => {
                                        return (
                                            <NavItem
                                                key={link.relativePath}
                                                className="pl-3"
                                                link={link}
                                                application={
                                                    this.props.application
                                                }
                                            >
                                                <Icon
                                                    className="float-left text-dark"
                                                    icon={link.icon}
                                                    fixedWidth
                                                />
                                                <Link
                                                    className="float-left nav-link text-dark pl-2"
                                                    to={`${
                                                        this.props.menu
                                                            .relativePath
                                                    }${link.relativePath}`}
                                                >
                                                    {link.name}
                                                </Link>
                                            </NavItem>
                                        );
                                    })}
                                </Nav>
                            </div>
                        );
                    })}
                </Links>
            </Container>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    menu: currentMenuSelector(state),
    application: currentApplicationSelector(state)
});

export default connect(mapStateToProps)(SideMenu);

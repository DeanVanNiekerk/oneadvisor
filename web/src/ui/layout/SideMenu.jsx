// @flow

import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Nav, NavItem as NavItemBs } from 'reactstrap';

import config from '@/config/config';
import type { State as RootState } from '@/state/rootReducer';
import type { Menu, MenuLink, Application } from '@/state/context/types';
import {
    currentMenuSelector,
    currentApplicationSelector
} from '@/state/context/selectors';

const Container = styled.div`
   background-color: #f0f0f0;
`;

const Section = styled.div`
  padding: 12px 10px;
`;

const NavItem = styled(NavItemBs)`
    ${props =>
        props.isCurrent &&
        css`
            background-color: #d4d4d4;
            border-left: 6px solid ${props => props.appColor};
        `}
    ${props =>
        !props.isCurrent &&
        css`
            border-left: 6px solid #f0f0f0;
        `}
`;

type Props = {
    className: string,
    menu: Menu,
    application: Application
};

class SideMenu extends Component<Props> {
    render() {
        return (
            <Container className="col-3 no bd-sidebar">
                <div className="bd-links">
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
                                                isCurrent={link.isCurrent}
                                                appColor={
                                                    this.props.application.color
                                                }
                                            >
                                                {/* <Icon className="float-left mt-2 text-dark">
                                                    {link.icon}
                                                </Icon> */}
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
                </div>
            </Container>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    menu: currentMenuSelector(state),
    application: currentApplicationSelector(state)
});

export default connect(mapStateToProps)(SideMenu);

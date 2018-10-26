import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { css }  from 'styled-components'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon';
import {
    Navbar as NavbarBs,
    NavItem as NavItemBs,
    NavbarBrand as NavbarBrandBs,
    Nav,
    NavLink
} from 'reactstrap';

import { applicationsSelector, currentApplicationSelector } from "state/context/selectors";

const NavItem = styled(NavItemBs)`
    padding: 0.4rem 1.5rem;
    ${props => props.isCurrent && css`
        background-color: ${props.appColor};
    `}
`;

const Navbar = styled(NavbarBs)`
    border-bottom: 4px solid ${props => props.appColor};

    -webkit-box-shadow: 0px 1px 12px 0px rgba(133,133,133,1);
    -moz-box-shadow: 0px 1px 12px 0px rgba(133,133,133,1);
    box-shadow: 0px 1px 12px 0px rgba(133,133,133,1);
`

const NavbarBrand = styled(NavbarBrandBs)`
    padding-right: 70px;
    font-size: 1.5rem !important;
`

class Navigator extends Component {

    render() {

        return (
            <Navbar color="primary" dark expand="md" sticky="top" appColor={this.props.currentApplication.color}>
                <NavbarBrand href="/">
                    <span className="font-weight-bold">ONE</span><span className="font-weight-light">ADVISOR</span>
                </NavbarBrand>
                <Nav className="mr-auto" navbar>
                    {this.props.applications.map(app => (
                        <NavItem key={app.id} appColor={app.color} isCurrent={app.isCurrent}>
                            <Icon className="float-left mt-2 text-light">{app.icon}</Icon>
                            <Link className="float-left nav-link active" to={app.relativePath}>
                                <span className="font-weight-light text-uppercase">{app.name}</span>
                            </Link>
                        </NavItem>
                    ))}
                </Nav>
                <Nav className="ml-auto" navbar>
                    <NavItem>
                        <NavLink href="#" onClick={this.props.onLogout}>Signout</NavLink>
                    </NavItem>
                </Nav>
            </Navbar>
        )
    }

}

Navigator.propTypes = {
    onLogout: PropTypes.func.isRequired,
    applications: PropTypes.array.isRequired,
    currentApplication: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    applications: applicationsSelector(state),
    currentApplication: currentApplicationSelector(state)
})

export default connect(mapStateToProps)(Navigator);




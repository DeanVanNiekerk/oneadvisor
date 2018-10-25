import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { css }  from 'styled-components'
import { connect } from 'react-redux'
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavLink
} from 'reactstrap';

import { applicationsSelector } from "state/context/selectors";

const NavItem = styled.li`
  ${props => props.isCurrent && css`
    background-color: ${props.color};
  `}
`;

class Navigator extends Component {

    render() {

        return (
            <Navbar color="primary" dark expand="md" sticky="top" >
                <NavbarBrand href="/">
                    One Advisor
                </NavbarBrand>
                <Nav className="mr-auto" navbar>
                    {this.props.applications.map(app => (
                        <NavItem key={app.id} className="nav-item" color={app.color} isCurrent={app.isCurrent}>
                            <Link className="nav-link active" to={app.relativePath}>{app.name}</Link>
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
    applications: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    applications: applicationsSelector(state)
})

export default connect(mapStateToProps)(Navigator);




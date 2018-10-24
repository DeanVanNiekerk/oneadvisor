import React from 'react';
import { Link } from 'react-router-dom';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

const Navigator = ({ onLogout }) => (

    <Navbar color="primary" dark expand="md" sticky="top" >
        <NavbarBrand href="/">
            One Advisor
            </NavbarBrand>
        <Nav className="mr-auto" navbar>
            <NavItem>
                <Link className="nav-link" to="/directory/users">Users</Link>
            </NavItem>
            <NavItem>
                <NavLink href="#" onClick={onLogout}>Signout</NavLink>
            </NavItem>
        </Nav>
    </Navbar>
);


export default Navigator;




import React from 'react';
import { Link } from 'react-router-dom';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import userManager from "auth/userManager";

class Navigator extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            isOpen: false
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    signout() {
        userManager.removeUser();
    }

    render() {

        return (
            <Navbar className="mb-3" color="primary" dark expand="md">
                <NavbarBrand href="/">
                    React App
                </NavbarBrand>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <Link className="nav-link" to="/users">Users</Link>
                        </NavItem>
                        <NavItem>
                            <NavLink href="#" onClick={() => this.signout()}>Signout</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}

export default Navigator




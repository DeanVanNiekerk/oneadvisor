// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components'
import { connect } from 'react-redux'
import Icon from '@material-ui/core/Icon';
import { withTheme } from '@material-ui/core/styles';

import AppBarMUI from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import type { TApplication } from 'state/context/types'

import { applicationsSelector, currentApplicationSelector } from "state/context/selectors";

const AppBar = styled(AppBarMUI)`
  z-index: ${props => props.theme.zIndex.drawer + 1} !important;
`


// const NavItem = styled(NavItemBs)`
//     padding: 0.4rem 1.5rem;
//     ${props => props.application.isCurrent && css`
//         background-color: ${props.application.color};
//     `}
// `;

// const Navbar = styled(NavbarBs)`
//     border-bottom: 4px solid ${props => props.application.color};

//     -webkit-box-shadow: 0px 1px 8px 0px rgba(36,36,36,0.71);
//     -moz-box-shadow: 0px 1px 8px 0px rgba(36,36,36,0.71);
//     box-shadow: 0px 1px 8px 0px rgba(36,36,36,0.71);
// `

// const NavbarBrand = styled(NavbarBrandBs)`
//     padding-right: 70px;
//     font-size: 1.5rem !important;
// `

type Props = {
    onLogout: any,
    applications: TApplication[],
    currentApplication: TApplication,
    theme: any
  };

class Navigator extends Component<Props> {

    render() {

        return (
            <AppBar position="fixed" theme={this.props.theme}>
                    <Toolbar>
                         <Typography variant="h6" color="inherit">
                            ONEADVISOR
                        </Typography>
                        <Button color="inherit">Signout</Button>
                    </Toolbar>
                </AppBar>
            // <Navbar color="primary" dark expand="md" sticky="top" application={this.props.currentApplication}>
            //     <NavbarBrand href="/">
            //         <span className="font-weight-bold">ONE</span><span className="font-weight-light">ADVISOR</span>
            //     </NavbarBrand>
            //     <Nav className="mr-auto" navbar>
            //         {this.props.applications.map(app => (
            //             <NavItem key={app.id} application={app}>
            //                 <Icon className="float-left mt-2 text-light">{app.icon}</Icon>
            //                 <Link className="float-left nav-link active" to={app.relativePath}>
            //                     <span className="font-weight-light text-uppercase">{app.name}</span>
            //                 </Link>
            //             </NavItem>
            //         ))}
            //     </Nav>
            //     <Nav className="ml-auto" navbar>
            //         <NavItemBs>
            //             <NavLink href="#" onClick={this.props.onLogout}>Signout</NavLink>
            //         </NavItemBs>
            //     </Nav>
            // </Navbar>
        )
    }

}

const mapStateToProps = state => ({
    applications: applicationsSelector(state),
    currentApplication: currentApplicationSelector(state) || {}
})

export default connect(mapStateToProps)(withTheme()(Navigator));




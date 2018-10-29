import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Nav, NavItem as NavItemBs } from 'reactstrap';
import Icon from '@material-ui/core/Icon';

import { currentMenuSelector, currentApplicationSelector } from "state/context/selectors";

const Wrapper = styled.div`
    order: 0;
    border-right: 3px solid #d4d4d4;
    background-color: #f0f0f0;
    position: sticky !important;
    top: 3.5rem;
    z-index: 1000;
    height: calc(100vh - 3.7rem);
    overflow-y: auto;
    padding-top: 1rem;

    font-size: 0.9rem;
    
    -webkit-box-shadow: inset -5px 0px 5px -4px rgba(212,212,212,1);
    -moz-box-shadow: inset -5px 0px 5px -4px rgba(212,212,212,1);
    box-shadow: inset -5px 0px 5px -4px rgba(212,212,212,1);
`;

const NavItem = styled(NavItemBs)`
    ${props => props.link.isCurrent && css`
        background-color: #d4d4d4;
        border-left: 6px solid ${props => props.application.color};
    `}
    ${props => !props.link.isCurrent && css`
        border-left: 6px solid #f0f0f0;
    `}
`;

class SideMenu extends React.Component {

    render() {

        return (
            <Wrapper>

                {this.props.menu.groups.map(group => {

                    return (<div key={group.name}>
                        <div className="pl-2 pb-1 text-uppercase">{group.name}</div>
                        <Nav className="flex-column">

                            {group.links.map(link => {
                                return (
                                    <NavItem key={link.relativePath} className="pl-3" application={this.props.application} link={link}>
                                        <Icon className="float-left mt-2 text-dark">{link.icon}</Icon>
                                        <Link className="float-left nav-link text-dark pl-2" to={`${this.props.menu.relativePath}${link.relativePath}`}>
                                            {link.name}
                                        </Link>
                                    </NavItem>
                                )})
                            }

                        </Nav>
                    </div>
                    )
                })}


            </Wrapper>
        );
    }
}

SideMenu.propTypes = {
    className: PropTypes.string,
    menu: PropTypes.object.isRequired,
    application: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    menu: currentMenuSelector(state),
    application: currentApplicationSelector(state)
})

export default connect(mapStateToProps)(SideMenu)




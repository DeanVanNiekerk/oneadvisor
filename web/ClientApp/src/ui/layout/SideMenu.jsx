import React from 'react';
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';

const Wrapper = styled.div`
    order: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    position: sticky !important;
    top: 3.5rem;
    z-index: 1000;
    height: calc(100vh - 3.5rem);
    overflow-y: auto;
`;

class SideMenu extends React.Component {

    render() {

        return (
            <Wrapper {...this.props}>
               
                <Nav className="flex-column">
                    <NavItem>
                        <Link className="nav-link active" to="/directory/users">Users</Link>
                    </NavItem>
                    <NavItem>
                        <Link className="nav-link active" to="/directory/users">Organisations</Link>
                    </NavItem>
                </Nav>

            </Wrapper>
        );
    }
}

export default SideMenu




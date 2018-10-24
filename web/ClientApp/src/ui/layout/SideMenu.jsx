import React from 'react';
import styled from 'styled-components'

const Wrapper = styled.div`
    order: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    position: sticky !important;
    top: 3.5rem;
    z-index: 1000;
    height: calc(100vh - 3.5rem);
`;

class SideMenu extends React.Component {

    render() {

        return (
            <Wrapper {...this.props}>
                <div className="bd-links">
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU 1</div>
                    <div className="p-3">MENU xxxxx</div>
                </div>
            </Wrapper>
        );
    }
}

export default SideMenu




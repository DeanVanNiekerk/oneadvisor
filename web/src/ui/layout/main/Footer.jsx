// @flow

import * as React from 'react';
import styled from 'styled-components';
import config from '@/config/config';

const Wrapper = styled.div`
    position: absolute;
    height: 55px;
    bottom: 0;
    width: calc(100% - ${config.ui.sideBarWidth}px);
    background-color: #E6E6E6
    border-top: 1px solid #C4C4C4
    padding: 10px 20px;
    display: flex;
    justify-content: flex-end;
`;

type Props = {
    children: React.Node
};

class Footer extends React.Component<Props> {
    render() {
        return (
            <Wrapper>
                {this.props.children}
            </Wrapper>
        );
    }
}

export { Footer };
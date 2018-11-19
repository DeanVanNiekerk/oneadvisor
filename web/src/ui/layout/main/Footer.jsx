// @flow

import * as React from 'react';
import styled from 'styled-components';
import config from '@/config/config';

type Props = {
    children: React.Node
};

const Footer = (props: Props) => (<Wrapper>{props.children}</Wrapper>);

const Wrapper = styled.div`
    position: absolute;
    height: 55px;
    bottom: 0;
    width: calc(100% - ${config.ui.sideBarWidth}px);
    background-color: #e6e6e6;
    border-top: 1px solid #c4c4c4;
    padding: 10px 20px;
    display: flex;
    justify-content: flex-end;
`;

export { Footer };

import React, { ReactNode } from 'react';
import styled from 'styled-components';

import config from '@/config/config';



type Props = {
    children: ReactNode
};

const Footer = (props: Props) => (<Wrapper className="px-3">{props.children}</Wrapper>);

const Wrapper = styled.footer`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: nowrap;
    position: sticky;
    bottom: 0;
    z-index: 1061;
    background-color: #C9C9C9;
    border-top: 1px solid #B5B5B5;
    height: ${config.ui.footerHeight}px;
`;

export { Footer };

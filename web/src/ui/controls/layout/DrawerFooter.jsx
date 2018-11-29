// @flow

import * as React from 'react';
import styled from 'styled-components';
import config from '@/config/config';

type Props = {
    children: React.Node
};

const DrawerFooter = (props: Props) => (<Wrapper>{props.children}</Wrapper>);

const Wrapper = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 4px 4px;
`;

export { DrawerFooter };
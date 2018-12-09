

import React, { ReactNode } from 'react';
import styled from 'styled-components';
import config from '@/config/config';

type Props = {
    children: ReactNode,
};

const Content = (props: Props) => (
    <Wrapper>{props.children}</Wrapper>
)

const Wrapper = styled.div`
    height: calc(100% - ${config.ui.footerHeight + config.ui.pageHeaderHeight}px);
`;

export { Content };

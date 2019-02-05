import React, { ReactNode } from 'react';
import styled from 'styled-components';

type Props = {
    children: ReactNode;
};

const PreviewCardContainer = (props: Props) => (
    <Wrapper>{props.children}</Wrapper>
);

const Wrapper = styled.div`
    background-color: #ececec;
    padding: 30px;
`;

export { PreviewCardContainer };

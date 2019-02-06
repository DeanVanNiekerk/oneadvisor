import { Row } from 'antd';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

type Props = {
    children: ReactNode;
};

const PreviewCardContainer = (props: Props) => (
    <Wrapper>
        <Row type="flex" gutter={16}>
            {props.children}
        </Row>
    </Wrapper>
);

const Wrapper = styled.div`
    background-color: #ececec;
    padding: 20px;
`;

export { PreviewCardContainer };

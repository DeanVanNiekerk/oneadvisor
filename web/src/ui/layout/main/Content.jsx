// @flow

import * as React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    height: calc(100% - 180px);
    overflow: auto;
`;

type Props = {
    children: React.Node
};

class Content extends React.Component<Props> {
    render() {
        return (
            <Wrapper>
                {this.props.children}
            </Wrapper>
        );
    }
}

export { Content };
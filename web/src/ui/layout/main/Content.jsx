// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import type { Dispatch } from '@/state/types';
import { recieveBreadCrumb } from '@/state/context/actions';

type Props = {
    children: React.Node,
    breadCrumb: string,
    dispatch: Dispatch
};

class ContentComponent extends React.Component<Props> {
    componentDidMount() {
        this.props.dispatch(recieveBreadCrumb(this.props.breadCrumb));
    }

    render() {
        return <ContentWrapper>{this.props.children}</ContentWrapper>;
    }
}

const ContentWrapper = styled.div`
    height: calc(100% - 180px);
    overflow: auto;
`;

export const Content = connect()(ContentComponent);

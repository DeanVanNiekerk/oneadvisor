// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import type { ReduxProps } from '@/state/types';
import { recieveBreadCrumb } from '@/state/context/actions';
import config from '@/config/config';

type LocalProps = {
    children: React.Node,
    breadCrumb: string,
};
type Props = LocalProps & ReduxProps;

class ContentComponent extends React.Component<Props> {
    componentDidMount() {
        this.props.dispatch(recieveBreadCrumb(this.props.breadCrumb));
    }

    render() {
        return <Wrapper>{this.props.children}</Wrapper>;
    }
}

const Wrapper = styled.div`
    position: absolute;
    height: calc(100% - 170px);
    width: calc(100% - ${config.ui.sideBarWidth}px);
    padding: 20px;
    overflow: auto;
    background-color: #FFFFFF;
`;

export const Content = connect()(ContentComponent);

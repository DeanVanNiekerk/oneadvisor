// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import config from '@/config/config';
import type { State as RootState } from '@/state/rootReducer';
import type { MenuLink, Application } from '@/state/context/types';
import {
    currentMenuLinkSelector,
    currentApplicationSelector
} from '@/state/context/selectors';

type Props = {
    link: MenuLink,
    application: Application,
    breadCrumb: string
};

class HeaderComponent extends Component<Props> {
    render() {
        return (
            <Wrapper
                className="px-3"
                application={this.props.application}
            >
                <Title>
                    {this.props.link.name}
                    {this.props.breadCrumb && <Light> / {this.props.breadCrumb}</Light>}
                </Title>
                <Toolbar>
                    Test
                </Toolbar>
            </Wrapper>
        );
    }
}

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    position: sticky;
    top: 4rem;
    z-index: 1061;
    color: #ffffff !important;
    background-color: ${props => props.application.color};
    height: ${config.ui.pageHeaderHeight}px;
`;

const Title = styled.div`
    font-size: 1.2rem;
    font-weight: 100;
`;

const Toolbar = styled.div`
   
`;

const Light = styled.span`
    font-weight: 100;
    font-size: 0.97rem;
`;

const mapStateToProps = (state: RootState) => ({
    link: currentMenuLinkSelector(state),
    application: currentApplicationSelector(state)
});

const Header = connect(mapStateToProps)(HeaderComponent)
export { Header };

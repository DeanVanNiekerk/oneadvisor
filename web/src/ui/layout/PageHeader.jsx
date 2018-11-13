// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import type { State as RootState } from '@/state/rootReducer';
import type { MenuLink, Application } from '@/state/context/types';
import {
    currentMenuLinkSelector,
    currentApplicationSelector,
    breadCrumbSelector
} from '@/state/context/selectors';

type Props = {
    link: MenuLink,
    application: Application,
    breadCrumb: string
};

class PageHeader extends Component<Props> {
    render() {
        return (
            <Row
                container
                direction="column"
                justify="center"
                alignItems="stretch"
                application={this.props.application}
            >
                <Header item>
                    {this.props.link.name}
                    {this.props.breadCrumb && <Light> / {this.props.breadCrumb}</Light>}
                </Header>
            </Row>
        );
    }
}

const Row = styled(Grid)`
    color: #ffffff !important;
    background-color: ${props => props.application.color};
    height: 53px;
    padding-top: 5px;
`;

const Header = styled(Grid)`
    font-size: 1.2rem;
    padding-left: 15px;
    font-weight: 500;
`;

const Light = styled.span`
    font-weight: 100;
    font-size: 0.97rem;
`;

const mapStateToProps = (state: RootState) => ({
    link: currentMenuLinkSelector(state),
    application: currentApplicationSelector(state),
    breadCrumb: breadCrumbSelector(state)
});

export default connect(mapStateToProps)(PageHeader);

// @flow

import React, { Component } from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import type { State as RootState } from "state/rootReducer";
import type { MenuLink, Application } from "state/context/types";
import {
  currentMenuLinkSelector,
  currentApplicationSelector
} from "state/context/selectors";

// const Row = styled.div`
//     color: #ffffff;
//     background-color: ${props => props.application.color};
//     height: 2.8rem;
// `

// const TitleColumn = styled.div`

// `

type Props = {
  link: MenuLink,
  application: Application
};

class PageHeader extends Component<Props> {
  render() {
    return (
      <div>todo</div>
      //    <Row application={this.props.application} className="row align-items-center">
      //         <TitleColumn className="col-auto font-weight-light">
      //             <span>{this.props.link.name}</span>
      //         </TitleColumn>
      //    </Row>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  link: currentMenuLinkSelector(state),
  application: currentApplicationSelector(state)
});

export default connect(mapStateToProps)(PageHeader);

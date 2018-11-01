// @flow

import React, { Component } from "react";
import styled from "styled-components";
import CssBaseline from "@material-ui/core/CssBaseline";

import Navigator from "./Navigator";
import SideMenu from "./SideMenu";
import PageHeader from "./PageHeader";
import Body from "./Body";

const Root = styled.div`
  display: flex;
`;

type Props = {
  onLogout: Function,
  children: any[]
};

class Layout extends Component<Props> {
  render() {
    return (
      <Root>
        <CssBaseline />
        <Navigator onLogout={this.props.onLogout} />
        <SideMenu />
        <Body>{this.props.children}</Body>
      </Root>
    );
  }
}

export default Layout;

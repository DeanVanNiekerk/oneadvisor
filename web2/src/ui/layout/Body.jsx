// @flow

import React, { Component } from "react";
import styled from "styled-components";
import { withTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

const Main = styled.div`
  flex-grow: 1 !important;
`;

type Props = {
  children: any[]
};

class Body extends Component<Props> {
  render() {
    return (
      <Main>
        <AppBar position="static">
          <Toolbar />
        </AppBar>
        {this.props.children}
      </Main>
    );
  }
}

export default withTheme()(Body);

// @flow

import React, { Component } from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Icon from "@material-ui/core/Icon";
import DrawerMUI from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AppBar from "@material-ui/core/AppBar";
import ListSubheader from "@material-ui/core/ListSubheader";

import type { State as RootState } from "state/rootReducer";
import type { Menu, Application } from "state/context/types";
import {
  currentMenuSelector,
  currentApplicationSelector
} from "state/context/selectors";

// const Wrapper = styled.div`
//     order: 0;
//     border-right: 3px solid #d4d4d4;
//     background-color: #f0f0f0;
//     position: sticky !important;
//     top: 3.5rem;
//     z-index: 1000;
//     height: calc(100vh - 3.7rem);
//     overflow-y: auto;
//     padding-top: 1rem;

//     font-size: 0.9rem;

//     -webkit-box-shadow: inset -5px 0px 5px -4px rgba(212,212,212,1);
//     -moz-box-shadow: inset -5px 0px 5px -4px rgba(212,212,212,1);
//     box-shadow: inset -5px 0px 5px -4px rgba(212,212,212,1);
// `;

// const NavItem = styled(NavItemBs)`
//     ${props => props.link.isCurrent && css`
//         background-color: #d4d4d4;
//         border-left: 6px solid ${props => props.application.color};
//     `}
//     ${props => !props.link.isCurrent && css`
//         border-left: 6px solid #f0f0f0;
//     `}
// `;

const drawerWidth = 240;

const Drawer = styled(DrawerMUI)`
  width: ${drawerWidth}px !important;
  flex-shrink: 0 !important;
`;
const styles = () => ({
  drawerPaper: {
    width: drawerWidth
  }
});

type Props = {
  className: string,
  menu: Menu,
  application: Application,
  classes: Object
};

class SideMenu extends Component<Props> {
  render() {
    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: this.props.classes.drawerPaper
        }}
      >
        <AppBar position="static">
          <Toolbar />
        </AppBar>

        {this.props.menu.groups.map(group => {
          return (
            <List
              key={group.name}
              subheader={<ListSubheader>{group.name}</ListSubheader>}
            >
              {group.links.map(link => {
                return (
                  <ListItem
                    key={link.relativePath}
                    application={this.props.application}
                    link={link}
                  >
                    <ListItemIcon>
                      <Icon>{link.icon}</Icon>
                    </ListItemIcon>
                    <ListItemText
                      to={`${this.props.menu.relativePath}${link.relativePath}`}
                    >
                      {link.name}
                    </ListItemText>
                  </ListItem>
                );
              })}
            </List>
          );
        })}
      </Drawer>
      // <Wrapper>

      //     {this.props.menu.groups.map(group => {

      //         return (<div key={group.name}>
      //             <div className="pl-2 pb-1 text-uppercase">{group.name}</div>
      //             <Nav className="flex-column">

      //                 {group.links.map(link => {
      //                     return (
      //                         <NavItem key={link.relativePath} className="pl-3" application={this.props.application} link={link}>
      //                             <Icon className="float-left mt-2 text-dark">{link.icon}</Icon>
      //                             <Link className="float-left nav-link text-dark pl-2" to={`${this.props.menu.relativePath}${link.relativePath}`}>
      //                                 {link.name}
      //                             </Link>
      //                         </NavItem>
      //                     )})
      //                 }

      //             </Nav>
      //         </div>
      //         )
      //     })}

      // </Wrapper>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  menu: currentMenuSelector(state),
  application: currentApplicationSelector(state)
});

export default connect(mapStateToProps)(withStyles(styles)(SideMenu));

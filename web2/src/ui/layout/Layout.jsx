import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import CssBaseline from '@material-ui/core/CssBaseline';

import Navigator from './Navigator';
import SideMenu from './SideMenu'
import PageHeader from './PageHeader'
import Body from './Body'


const Root = styled.div`
  display: flex;
`


class Layout extends React.Component {

  render() {

    return (
      <Root>

        <CssBaseline />

        <Navigator onLogout={this.props.onLogout} />

        <SideMenu />

        <Body>
          {this.props.children}
        </Body>

      </Root>




      //  <div className="row no-gutters">
      //   <div style={{ "flex": "250px 0" }} className="col">
      //     <SideMenu />
      //   </div>
      //   <main className="col">
      //     <PageHeader />
      //     {this.props.children}
      //   </main>
      // </div> 

    );
  }
}

Layout.propTypes = {
  onLogout: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired
};

export default Layout




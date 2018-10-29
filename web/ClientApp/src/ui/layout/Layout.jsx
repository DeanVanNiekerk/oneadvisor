import React from 'react';
import PropTypes from 'prop-types';
import Navigator from './Navigator';
import SideMenu from './SideMenu'
import PageHeader from './PageHeader'

class Layout extends React.Component {

  render() {

    return (
      <div>
        <Navigator onLogout={this.props.onLogout} />
        <div className="container-fluid p-0">
          <div className="row no-gutters">
            <div style={{"flex": "250px 0"}} className="col">
              <SideMenu />
            </div>
            <main className="col">
              <PageHeader />
              {this.props.children}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

Layout.propTypes = {
  onLogout: PropTypes.func.isRequired,
  children: PropTypes.array.isRequired
};

export default Layout




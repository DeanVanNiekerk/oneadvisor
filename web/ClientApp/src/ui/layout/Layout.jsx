import React from 'react';
import PropTypes from 'prop-types';
import Navigator from './Navigator';
import SideMenu from './SideMenu'

class Layout extends React.Component {

  render() {

    return (
      <div>
        <Navigator onLogout={this.props.onLogout} />
        <div className="container-fluid">
          <div className="row">
            <div style={{"flex": "250px 0"}} className="col pl-0 pr-0">
              <SideMenu />
            </div>
            <main className="col">
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




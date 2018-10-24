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
            <SideMenu className="col-3 col-xl-2 bg-success"/>
            <main className="col-9 col-xl-10">
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




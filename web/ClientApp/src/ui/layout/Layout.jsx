import React from 'react';
import Navigator from 'ui/layout/Navigator';

class Layout extends React.Component {

  render() {
    return (
      <div>
        <Navigator />
        <div className="container-fluid">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Layout




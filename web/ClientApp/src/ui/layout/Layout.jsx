import React from 'react';
import Navigator from 'ui/layout/Navigator';
import { withAuth } from '@okta/okta-react';
import { connect } from 'react-redux'

import { recieveAuthentication, clearAuthentication } from 'state/auth/actions'

class Layout extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      authenticated: null
    };

    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
    this.checkAuthentication();
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  async checkAuthentication() {

    const authenticated = await this.props.auth.isAuthenticated();

    if(this.props.authenticated === authenticated)
      return;

    if (authenticated) {
      const userinfo = await this.props.auth.getUser();
      const idToken = await this.props.auth.getIdToken();
      const accessToken = await this.props.auth.getAccessToken();
      this.props.dispatch(recieveAuthentication(userinfo, idToken, accessToken));
    } else {
      this.props.dispatch(clearAuthentication(null));
    }

  }

  logout() {
    this.props.auth.logout('/');
  }

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

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
  userInfo: state.auth.userInfo,
})

export default connect(mapStateToProps)(withAuth(Layout))




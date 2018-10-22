
import React from 'react';
import { withAuth } from '@okta/okta-react';
import { connect } from 'react-redux'

import Layout from 'ui/layout/Layout';
import Loader from 'ui/common/Loader'

import { recieveAuthentication, clearAuthentication } from 'state/auth/actions'

class Authentication extends React.Component {

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.checkAuthentication = this.checkAuthentication.bind(this);
  }

  async componentDidMount() {
    this.checkAuthentication();
  }

  async componentDidUpdate() {
    this.checkAuthentication();
  }

  async checkAuthentication() {

    const authenticated = await this.props.auth.isAuthenticated();

    if (!authenticated) {
      this.props.auth.redirect();
      return;
    }

    if (this.props.authenticated === authenticated)
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
    this.props.auth.logout();
  }

  render() {

    if (!this.props.authenticated)
      return <div className="container-fluid"><Loader text="signing in..." /></div>

    return (
      <Layout onLogout={this.logout}>
        {this.props.children}
      </Layout>
    );

  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
  userInfo: state.auth.userInfo,
})

export default connect(mapStateToProps)(withAuth(Authentication))




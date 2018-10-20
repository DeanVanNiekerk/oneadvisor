import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Table } from 'reactstrap';

import userManager from "auth/userManager";

import Loader from 'ui/common/Loader'
import Error from 'ui/common/Error'
import { fetchUsers } from 'state/users/list/actions'

class UserListPage extends Component {

  componentDidMount() {
    this.props.dispatch(fetchUsers());
  }

  onLoginButtonClick(event) {
    event.preventDefault();
    userManager.signinRedirect();
  }

  render() {

    if (this.props.error)
      return <Error />
    if (this.props.fetching)
      return <Loader text="loading users..." />

    return (
      <div>
        <h3>Users</h3>
        <button onClick={this.onLoginButtonClick}>Login</button>
        <Table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
                {this.props.users.map(user =>
                    <tr key={user.id}>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                    </tr>
                )}
            </tbody>
        </Table>
      </div>
    )

  }
}

const mapStateToProps = state => ({
  users: state.users.list.items || [],
  fetching: state.users.list.fetching,
  error: state.users.list.error
})

export default connect(mapStateToProps)(UserListPage)
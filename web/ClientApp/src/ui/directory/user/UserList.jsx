import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Table } from 'reactstrap';

import Loader from 'ui/common/Loader'
import Error from 'ui/common/Error'

import { listSelector } from 'state/directory/users/list/selectors'
import { fetchUsers } from 'state/directory/users/list/actions'

class UserList extends Component {

  componentDidMount() {
    this.props.dispatch(fetchUsers());
  }

  render() {

    if (this.props.error)
      return <Error />
    if (this.props.fetching)
      return <Loader text="loading users..." />

    return (
      <div>
        <h3>Users</h3>
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
  users: listSelector(state).items || [],
  fetching: listSelector(state).fetching,
  error: listSelector(state).error
})

export default connect(mapStateToProps)(UserList)
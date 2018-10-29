import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { Table } from 'reactstrap';

import Loader from 'ui/common/Loader'
import Error from 'ui/common/Error'

import { listSelector } from 'state/app/directory/users/list/selectors'
import { fetchUsers } from 'state/app/directory/users/list/actions'

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
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
                {this.props.users.map(user =>
                    <tr key={user.id}>
                        <td>{user.id}</td>
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

UserList.propTypes = {
  error: PropTypes.bool.isRequired,
  fetching: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  users: listSelector(state).items || [],
  fetching: listSelector(state).fetching,
  error: listSelector(state).error
})

export default connect(mapStateToProps)(UserList)
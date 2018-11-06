// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Loader from 'ui/common/Loader'
import Error from 'ui/common/Error'

import type { Dispatch } from 'state/types';
import type { State as RootState } from 'state/rootReducer'
import { listSelector } from 'state/app/directory/users/list/selectors'
import { fetchUsers } from 'state/app/directory/users/list/actions'
import type { User } from 'state/app/directory/users/list/types'

type Props = {
    users: User[],
    fetching: boolean,
    error: boolean,
    dispatch: Dispatch
  };

class UserList extends Component<Props> {

  componentDidMount() {
    this.props.dispatch(fetchUsers());
  }

  render() {

    if (this.props.error)
      return <Error />
    if (this.props.fetching)
      return <Loader text="loading users..." />

    return (
      <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
                {this.props.users.map(user =>
                    <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.firstName}</TableCell>
                        <TableCell>{user.lastName}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )

  }
}

const mapStateToProps = (state: RootState) => ({
  users: listSelector(state).items || [],
  fetching: listSelector(state).fetching,
  error: listSelector(state).error
})

export default connect(mapStateToProps)(UserList)
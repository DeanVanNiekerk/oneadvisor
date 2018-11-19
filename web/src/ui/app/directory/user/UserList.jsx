// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';


import Loader from '@/ui/common/Loader';
import Error from '@/ui/common/Error';

import type { RouterProps, ReduxProps } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import { listSelector } from '@/state/app/directory/users/list/selectors';
import { fetchUsers } from '@/state/app/directory/users/list/actions';
import type { User } from '@/state/app/directory/users/types';

type LocalProps = {
    users: User[],
    fetching: boolean,
    error: boolean,
};
type Props = LocalProps & RouterProps & ReduxProps;

class UserList extends Component<Props> {
    componentDidMount() {
        this.props.dispatch(fetchUsers());
    }

    editUser = (id) => {
        this.props.history.push(`/directory/users/${id}`)
    }

    render() {
        if (this.props.error) return <Error />;
        if (this.props.fetching) return <Loader text="loading users..." />;

        return (
            <table class="table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.users.map(user => (
                        <tr key={user.id} onClick={() => this.editUser(user.id)}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                        </tr>
                    ))}
                    {this.props.users.map(user => (
                        <tr key={user.id} onClick={() => this.editUser(user.id)}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                        </tr>
                    ))}
                    {this.props.users.map(user => (
                        <tr key={user.id} onClick={() => this.editUser(user.id)}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                        </tr>
                    ))}
                    {this.props.users.map(user => (
                        <tr key={user.id} onClick={() => this.editUser(user.id)}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                        </tr>
                    ))}
                    {this.props.users.map(user => (
                        <tr key={user.id} onClick={() => this.editUser(user.id)}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    users: listSelector(state).items || [],
    fetching: listSelector(state).fetching,
    error: listSelector(state).error
});

export default withRouter(connect(mapStateToProps)(UserList));

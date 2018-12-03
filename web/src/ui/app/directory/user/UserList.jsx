// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tag } from 'antd';

import { Table, Header, Button } from '@/ui/controls';

import EditUser from './EditUser';

import { getColumn } from '@/state/utils';
import type { ReduxProps } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';

import type { Organisation } from '@/state/app/directory/organisations/types';
import { listSelector as organisationsSelector } from '@/state/app/directory/organisations/list/selectors';
import { fetchOrganisations } from '@/state/app/directory/organisations/list/actions';
import { listSelector as usersSelector } from '@/state/app/directory/users/list/selectors';
import { fetchUsers } from '@/state/app/directory/users/list/actions';
import { receiveUser } from '@/state/app/directory/users/user/actions';
import type { User } from '@/state/app/directory/users/types';

type LocalProps = {
    users: User[],
    organisations: Organisation[],
    fetching: boolean,
    error: boolean
};
type Props = LocalProps & ReduxProps;

type State = {
    editVisible: boolean
};

class UserList extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            editVisible: false
        };
    }

    componentDidMount() {
        if (this.props.users.length === 0) this.loadUsers();

        if (this.props.organisations.length === 0) this.loadOrganisations();
    }

    loadUsers = () => {
        this.props.dispatch(fetchUsers());
    };

    loadOrganisations = () => {
        this.props.dispatch(fetchOrganisations());
    };

    newUser = id => {
        const user = {
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            login: '',
            lastLogin: '',
            lastUpdated: '',
            lastUpdated: '',
            status: '',
            organisationId: this.props.organisations[0].id
        };
        this.showEditUser(user);
    };

    editUser = id => {
        const user = this.props.users.find(u => u.id === id);
        if (user) this.showEditUser(user);
    };

    getOrganisationName = id => {
        const organisation = this.props.organisations.find(u => u.id === id);
        if (organisation) return organisation.name;
    };

    showEditUser = (user: User) => {
        this.props.dispatch(receiveUser(user));
        this.setState({
            editVisible: true
        });
    };

    closeEditUser = (cancelled: boolean) => {
        this.setState({
            editVisible: false
        });
        if (!cancelled) this.loadUsers();
    };

    getColumns = () => {
        return [
            getColumn('id', 'Id'),
            getColumn('firstName', 'First Name'),
            getColumn('lastName', 'Last Name'),
            getColumn('email', 'Email'),
            getColumn('login', 'Login'),
            getColumn('lastLogin', 'Last Login', { type: 'date' }),
            getColumn('organisationId', 'Organisation', {
                render: (organisationId: string) => {
                    return this.getOrganisationName(organisationId);
                }
            }),
            getColumn('status', 'Status', {
                render: (status: string) => {
                    switch (status.toUpperCase()) {
                        case 'STAGED':
                            return <Tag color="cyan">{status}</Tag>;
                        case 'PROVISIONED':
                            return <Tag color="blue">{status}</Tag>;
                        case 'ACTIVE':
                            return <Tag color="green">{status}</Tag>;
                        case 'RECOVERY':
                        case 'LOCKED_OUT':
                        case 'PASSWORD_EXPIRED':
                            return <Tag color="volcano">{status}</Tag>;
                        case 'DEPROVISIONED':
                        case 'SUSPENDED':
                            return <Tag color="red">{status}</Tag>;
                    }
                }
            })
        ];
    };

    render() {
        return (
            <>
                <Header
                    actions={
                        <Button
                            type="default"
                            icon="plus"
                            onClick={this.newUser}
                            disabled={this.props.fetching}
                        >
                            New User
                        </Button>
                    }
                >
                    Users
                </Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.users}
                    loading={this.props.fetching}
                    onRowClick={user => this.editUser(user.id)}
                />
                <EditUser
                    visible={this.state.editVisible}
                    onClose={this.closeEditUser}
                    organisations={this.props.organisations}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const usersState = usersSelector(state);
    const organisationsState = organisationsSelector(state);

    return {
        users: usersState.items,
        organisations: organisationsState.items,
        fetching: usersState.fetching || organisationsState.fetching,
        error: usersState.error
    };
};

export default connect(mapStateToProps)(UserList);

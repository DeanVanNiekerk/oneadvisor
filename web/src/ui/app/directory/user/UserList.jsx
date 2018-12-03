// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Tag } from 'antd';

import { Table, Header, Button } from '@/ui/controls';

import EditUser from './EditUser';

import { getColumn } from '@/state/utils';
import type { RouterProps, ReduxProps } from '@/state/types';
import type { State as RootState } from '@/state/rootReducer';
import { listSelector } from '@/state/app/directory/users/list/selectors';
import { fetchUsers } from '@/state/app/directory/users/list/actions';
import {
    fetchUser,
    receiveUser
} from '@/state/app/directory/users/user/actions';
import type { User } from '@/state/app/directory/users/types';

type LocalProps = {
    users: User[],
    fetching: boolean,
    error: boolean
};
type Props = LocalProps & RouterProps & ReduxProps;

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
        this.loadUsers();
    }

    loadUsers = () => {
        this.props.dispatch(fetchUsers());
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
            organisationId: ''
        };
        this.props.dispatch(receiveUser(user));
        this.setState({
            editVisible: true
        });
    };

    editUser = id => {
        this.props.dispatch(fetchUser(id));
        this.setState({
            editVisible: true
        });
    };

    closeEditUser = (cancelled: boolean) => {
        this.setState({
            editVisible: false
        });
        if(!cancelled)
            this.loadUsers();
    };

    getColumns = () => {
        return [
            getColumn('id', 'Id'), 
            getColumn('firstName', 'First Name'),
            getColumn('lastName', 'Last Name'),
            getColumn('email', 'Email'),
            getColumn('login', 'Login'),
            getColumn('lastLogin', 'Last Login', { type: 'date' }),
            getColumn('status', 'Status', { 
                render: (status: string) => {
                    switch(status.toUpperCase()) {
                        case 'STAGED':
                            return <Tag color="cyan">{status}</Tag>
                        case 'PROVISIONED':
                            return <Tag color="blue">{status}</Tag>
                        case 'ACTIVE':
                            return <Tag color="green">{status}</Tag>
                        case 'RECOVERY':
                        case 'LOCKED_OUT':
                        case 'PASSWORD_EXPIRED':
                            return <Tag color="volcano">{status}</Tag>
                        case 'DEPROVISIONED':
                        case 'SUSPENDED':
                            return <Tag color="red">{status}</Tag>
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
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    users: listSelector(state).items || [],
    fetching: listSelector(state).fetching,
    error: listSelector(state).error
});

export default withRouter(connect(mapStateToProps)(UserList));

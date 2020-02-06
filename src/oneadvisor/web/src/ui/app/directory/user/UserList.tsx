import { Tag } from "antd";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { getColumnDefinition } from "@/app/table";
import {
    fetchOrganisations,
    Organisation,
    organisationsSelector,
} from "@/state/app/directory/organisations";
import {
    fetchUser,
    fetchUsers,
    receiveUser,
    User,
    UserEdit,
    usersSelector,
} from "@/state/app/directory/users";
import { fetchUsersSimple } from "@/state/app/directory/usersSimple";
import { RootState } from "@/state/rootReducer";
import { Button, getTable, Header } from "@/ui/controls";

import EditUser from "./EditUser";

const Table = getTable<User>();

type Props = {
    users: User[];
    organisations: Organisation[];
    fetching: boolean;
} & DispatchProp;

type State = {
    editVisible: boolean;
};

class UserList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editVisible: false,
        };
    }

    componentDidMount() {
        if (this.props.users.length === 0) this.loadUsers();
        if (this.props.organisations.length === 0) this.loadOrganisations();
    }

    loadUsers = () => {
        this.props.dispatch(fetchUsers());
        this.props.dispatch(fetchUsersSimple());
    };

    loadOrganisations = () => {
        this.props.dispatch(fetchOrganisations());
    };

    newUser = () => {
        const user: UserEdit = {
            id: null,
            firstName: "",
            lastName: "",
            email: "",
            userName: "",
            branchId: "",
            scope: 1,
            roles: [],
            aliases: [],
            isLocked: false,
            userTypeId: "",
        };

        this.props.dispatch(receiveUser(user));
        this.showEditUser();
    };

    editUser = (id: string) => {
        this.props.dispatch(fetchUser(id));
        this.showEditUser();
    };

    getOrganisationName = (id: string) => {
        const organisation = this.props.organisations.find(u => u.id === id);
        if (organisation) return organisation.name;
    };

    showEditUser = () => {
        this.setState({
            editVisible: true,
        });
    };

    closeEditUser = (cancelled: boolean) => {
        this.setState({
            editVisible: false,
        });
        if (!cancelled) this.loadUsers();
    };

    getColumns = () => {
        const getColumn = getColumnDefinition<User>();
        return [
            getColumn("lastName", "Last Name"),
            getColumn("firstName", "First Name"),
            getColumn("email", "Email"),
            getColumn("organisationName", "Organisation"),
            getColumn("branchName", "Branch"),
            getColumn(
                "emailConfirmed",
                "Activated",
                {},
                {
                    render: (emailConfirmed: boolean) => {
                        return emailConfirmed ? (
                            <Tag color="green">Yes</Tag>
                        ) : (
                            <Tag color="volcano">No</Tag>
                        );
                    },
                }
            ),
            getColumn(
                "isLocked",
                "Locked",
                {},
                {
                    render: (isLocked: boolean) => {
                        return !isLocked ? (
                            <Tag color="green">No</Tag>
                        ) : (
                            <Tag color="volcano">Yes</Tag>
                        );
                    },
                }
            ),
            getColumn(
                "scope",
                "Scope",
                {},
                {
                    render: (scope: number) => {
                        switch (scope) {
                            case 1:
                                return <Tag color="purple">Organisation</Tag>;
                            case 2:
                                return <Tag color="blue">Branch</Tag>;
                            case 3:
                                return <Tag color="magenta">User</Tag>;
                        }
                    },
                }
            ),
        ];
    };

    render() {
        return (
            <>
                <Header
                    icon="team"
                    actions={
                        <Button
                            type="default"
                            icon="plus"
                            onClick={this.newUser}
                            disabled={this.props.fetching}
                            requiredUseCase="dir_edit_users"
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
    };
};

export default connect(mapStateToProps)(UserList);

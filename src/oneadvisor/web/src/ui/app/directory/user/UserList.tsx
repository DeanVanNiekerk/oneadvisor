import { Tag } from "antd";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction, bindActionCreators } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getColumnDefinition } from "@/app/table";
import { RootState } from "@/state";
import {
    fetchUser,
    fetchUsers,
    receiveUser,
    User,
    usersSelector,
    userVisible,
} from "@/state/directory/users";
import { getConfig } from "@/state/directory/users/helpers";
import { fetchUsersSimple } from "@/state/lookups/directory/usersSimple";
import { Button, getTable, Header } from "@/ui/controls";

import EditUser from "./EditUser";

const Table = getTable<User>();

type Props = PropsFromState & PropsFromDispatch;

const UserList: React.FC<Props> = (props) => {
    useEffect(() => {
        props.fetchUsers();
        props.fetchUsersSimple();
    }, []);

    return (
        <>
            <Header
                iconName="team"
                actions={
                    <Button
                        type="default"
                        iconName="plus"
                        onClick={props.newUser}
                        disabled={props.fetching}
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
                columns={getColumns()}
                dataSource={props.users}
                loading={props.fetching}
                onRowClick={(user) => props.editUser(user.id)}
            />
            <EditUser
                onSaved={() => {
                    props.fetchUsers();
                    props.fetchUsersSimple();
                }}
            />
        </>
    );
};

const getColumns = () => {
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
                    return !isLocked ? <Tag color="green">No</Tag> : <Tag color="volcano">Yes</Tag>;
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

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const usersState = usersSelector(state);

    return {
        users: usersState.items,
        fetching: usersState.fetching,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        ...bindActionCreators({ fetchUsersSimple, fetchUsers }, dispatch),
        newUser: () => {
            const config = getConfig();
            dispatch(
                receiveUser({
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
                    config: {
                        ...config,
                    },
                })
            );
            dispatch(userVisible(true));
        },
        editUser: (userId: string) => {
            dispatch(fetchUser(userId));
            dispatch(userVisible(true));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserList);

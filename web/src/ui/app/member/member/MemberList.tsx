import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { Filters, getColumn, PageOptions, SortOptions } from '@/app/table';
import { Identity, identitySelector } from '@/state/app/directory/identity';
import { fetchUsersSimple, UserSimple, usersSimpleSelector } from '@/state/app/directory/usersSimple';
import {
    fetchMembers, Member, MemberEdit, membersSelector, receiveFilters, receiveMember, receivePageOptions,
    receiveSortOptions
} from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';
import { Button, Header, Table } from '@/ui/controls';

import EditMember from './EditMember';

type Props = {
    members: Member[];
    users: UserSimple[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    filters: Filters;
    identity: Identity;
} & RouteComponentProps &
    DispatchProp;

class MemberList extends Component<Props> {
    componentDidMount() {
        if (this.props.members.length === 0) this.loadMembers();
        if (this.props.users.length === 0) this.loadUsers();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions ||
            prevProps.filters != this.props.filters
        )
            this.loadMembers();
    }

    loadMembers = () => {
        this.props.dispatch(
            fetchMembers(
                this.props.pageOptions,
                this.props.sortOptions,
                this.props.filters
            )
        );
    };

    loadUsers = () => {
        this.props.dispatch(fetchUsersSimple());
    };

    editMember = (id: string) => {
        this.props.history.push(`/member/members/${id}`);
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) this.loadMembers();
    };

    newMember = () => {
        const member: MemberEdit = {
            id: null,
            userId: this.props.identity.id,
            firstName: '',
            lastName: '',
            maidenName: '',
            idNumber: '',
            initials: '',
            preferredName: '',
            dateOfBirth: ''
        };

        this.props.dispatch(receiveMember(member));
    };

    getColumns = () => {
        return [
            getColumn('lastName', 'Last Name', { showSearchFilter: true }),
            getColumn('firstName', 'First Name', { showSearchFilter: true }),
            getColumn('idNumber', 'ID Number', { showSearchFilter: true }),
            getColumn('dateOfBirth', 'Date of Birth', { type: 'date' }),
            getColumn('userId', 'Broker', {
                render: (userId: string, member: Member) => {
                    return `${member.userFirstName} ${member.userLastName}`;
                },
                filters: this.props.users.map(user => ({
                    text: `${user.firstName} ${user.lastName}`,
                    value: user.id
                }))
            })
        ];
    };

    onTableChange = (
        pageOptions: PageOptions,
        sortOptions: SortOptions,
        filters: Filters
    ) => {
        if (this.props.pageOptions != pageOptions)
            this.props.dispatch(receivePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions)
            this.props.dispatch(receiveSortOptions(sortOptions));
        if (this.props.filters != filters)
            this.props.dispatch(receiveFilters(filters));
    };

    render() {
        return (
            <>
                <Header
                    actions={
                        <>
                            <Button
                                type="default"
                                icon="sync"
                                onClick={this.loadMembers}
                                disabled={this.props.fetching}
                            >
                                Reload
                            </Button>
                            <Button
                                type="default"
                                icon="plus"
                                onClick={this.newMember}
                                disabled={this.props.fetching}
                                requiredUseCase="mem_edit_members"
                            >
                                New Member
                            </Button>
                        </>
                    }
                >
                    Members
                </Header>
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.members}
                    loading={this.props.fetching}
                    onRowClick={member => this.editMember(member.id)}
                    onRowClickRequiredUseCase="mem_edit_members"
                    externalDataSource={true}
                    pageOptions={this.props.pageOptions}
                    totalRows={this.props.totalItems}
                    onTableChange={this.onTableChange}
                />
                <EditMember onClose={this.onFormClose} />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const membersState = membersSelector(state);
    const usersState = usersSimpleSelector(state);

    return {
        members: membersState.items,
        users: usersState.items,
        fetching: membersState.fetching || usersState.fetching,
        pageOptions: membersState.pageOptions,
        sortOptions: membersState.sortOptions,
        totalItems: membersState.totalItems,
        filters: membersState.filters,
        identity: identitySelector(state).identity
    };
};

export default connect(mapStateToProps)(MemberList);

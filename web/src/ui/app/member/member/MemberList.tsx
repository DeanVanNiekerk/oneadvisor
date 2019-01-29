import { Popconfirm } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { applyLike } from '@/app/query';
import { Filters, getColumn, PageOptions, SortOptions } from '@/app/table';
import {
    deleteMember, fetchMembers, Member, MemberEdit, membersSelector, receiveFilters, receiveMember, receivePageOptions,
    receiveSortOptions
} from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';
import { Button, Header, StopPropagation, Table } from '@/ui/controls';

import EditMember from './EditMember';

type Props = {
    members: Member[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    filters: Filters;
} & RouteComponentProps &
    DispatchProp;

class MemberList extends Component<Props> {
    componentDidMount() {
        if (this.props.members.length === 0) this.loadMembers();
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

    editMember = (id: string) => {
        this.props.history.push(`/member/members/${id}`);
    };

    deleteMember = (id: string) => {
        this.props.dispatch(deleteMember(id, this.loadMembers));
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) this.loadMembers();
    };

    newMember = () => {
        const member: MemberEdit = {
            id: null,
            firstName: '',
            lastName: '',
            maidenName: '',
            idNumber: '',
            passportNumber: '',
            initials: '',
            preferredName: '',
            dateOfBirth: '',
            marriageDate: '',
            marritalStatusId: '',
            taxNumber: ''
        };

        this.props.dispatch(receiveMember(member));
    };

    getColumns = () => {
        return [
            getColumn('lastName', 'Last Name', { showSearchFilter: true }),
            getColumn('firstName', 'First Name', { showSearchFilter: true }),
            getColumn('idNumber', 'ID Number', { showSearchFilter: true }),
            getColumn('dateOfBirth', 'Date of Birth', { type: 'date' }),
            getColumn('id', 'Actions', {
                render: (id: string) => {
                    return (
                        <StopPropagation>
                            <a
                                href="#"
                                className="mr-1"
                                onClick={() => this.editMember(id)}
                            >
                                Edit
                            </a>
                            <Popconfirm
                                title="Are you sure remove this member?"
                                onConfirm={() => this.deleteMember(id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <a href="#">Remove</a>
                            </Popconfirm>
                        </StopPropagation>
                    );
                }
            })
        ];
    };

    updateFilters = (filters: Filters): Filters => {
        return applyLike(filters, ['firstName', 'lastName', 'idNumber']);
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
            this.props.dispatch(receiveFilters(this.updateFilters(filters)));
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

    return {
        members: membersState.items,
        fetching: membersState.fetching,
        pageOptions: membersState.pageOptions,
        sortOptions: membersState.sortOptions,
        totalItems: membersState.totalItems,
        filters: membersState.filters
    };
};

export default connect(mapStateToProps)(MemberList);

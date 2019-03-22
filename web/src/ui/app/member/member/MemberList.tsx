import { Popconfirm } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { applyLike } from '@/app/query';
import { Filters, getColumnEDS, PageOptions, SortOptions } from '@/app/table';
import {
    deleteMember, fetchMembers, fetchMergeMembers, Member, MemberEdit, memberMergeReset, membersSelector, newMember,
    receiveFilters, receiveMember, receiveMemberPreview, receivePageOptions, receiveSelectedMembers, receiveSortOptions
} from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';
import { Button, Header, StopPropagation, Table } from '@/ui/controls';

import MemberMerge from '../merge/MemberMerge';
import EditMember from './EditMember';

type Props = {
    members: Member[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
    filters: Filters;
    selectedMemberIds: string[];
} & RouteComponentProps &
    DispatchProp;

type State = {
    memberEditVisible: boolean;
    memberMergeVisible: boolean;
};

class MemberList extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            memberEditVisible: false,
            memberMergeVisible: false,
        };
    }

    componentDidMount() {
        this.loadMembers();
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
        this.props.dispatch(receiveMemberPreview(null));
        this.props.history.push(`/member/members/${id}`);
    };

    deleteMember = (id: string) => {
        this.props.dispatch(deleteMember(id, this.loadMembers));
    };

    onDataChange = (cancelled: boolean) => {
        if (!cancelled) this.loadMembers();
    };

    newMember = () => {
        const member: MemberEdit = newMember();
        this.props.dispatch(receiveMember(member));
        this.toggleMemberEditVisible();
    };

    getColumns = () => {
        return [
            getColumnEDS("lastName", "Last Name", { showSearchFilter: true }),
            getColumnEDS("firstName", "First Name", { showSearchFilter: true }),
            getColumnEDS("idNumber", "ID Number", { showSearchFilter: true }),
            getColumnEDS("dateOfBirth", "Date of Birth", { type: "date" }),
            getColumnEDS("id", "Actions", {
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
                },
            }),
        ];
    };

    updateFilters = (filters: Filters): Filters => {
        return applyLike(filters, ["firstName", "lastName", "idNumber"]);
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

    onMemberSelected = (selectedMemberIds: string[]) => {
        this.props.dispatch(receiveSelectedMembers(selectedMemberIds));
    };

    toggleMemberEditVisible = () => {
        this.setState({
            memberEditVisible: !this.state.memberEditVisible,
        });
    };

    closeMemberEdit = (cancelled: boolean) => {
        this.onDataChange(cancelled);
        this.toggleMemberEditVisible();
    };

    toggleMemberMergeVisible = () => {
        this.setState({
            memberMergeVisible: !this.state.memberMergeVisible,
        });
    };

    closeMemberMerge = (cancelled: boolean) => {
        this.onDataChange(cancelled);
        this.toggleMemberMergeVisible();
    };

    openMemberMerge = () => {
        this.props.dispatch(memberMergeReset());
        this.props.dispatch(fetchMergeMembers(this.props.selectedMemberIds));
        this.toggleMemberMergeVisible();
    };

    clearAllSelectedMembers = () => {
        this.props.dispatch(receiveSelectedMembers([]));
    };

    render() {
        return (
            <>
                <Header
                    icon="user"
                    actions={
                        <>
                            <Button
                                type="primary"
                                icon="fork"
                                onClick={this.openMemberMerge}
                                visible={
                                    this.props.selectedMemberIds.length > 1
                                }
                                requiredUseCase="mem_edit_members"
                            >
                                Merge
                            </Button>
                            <Button
                                type="primary"
                                icon="delete"
                                onClick={this.clearAllSelectedMembers}
                                visible={
                                    this.props.selectedMemberIds.length > 0
                                }
                            >
                                Clear All Selected
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
                    rowSelection={{
                        onChange: this.onMemberSelected,
                        selectedRowKeys: this.props.selectedMemberIds,
                    }}
                />
                <EditMember
                    onClose={this.closeMemberEdit}
                    visible={this.state.memberEditVisible}
                />
                <MemberMerge
                    onClose={this.closeMemberMerge}
                    visible={this.state.memberMergeVisible}
                />
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
        filters: membersState.filters,
        selectedMemberIds: membersState.selectedMemberIds,
    };
};

export default withRouter(connect(mapStateToProps)(MemberList));

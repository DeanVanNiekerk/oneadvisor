import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getColumn } from '@/app/table';
import { PageOptions, SortOptions } from '@/app/types';
import {
    fetchMember, fetchMembers, Member, MemberEdit, membersSelector, receiveMember, receivePageOptions,
    receiveSortOptions
} from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';
import { Button, Header, Table } from '@/ui/controls';

import EditMember from './EditMember';

type Props = {
    members: Member[];
    fetching: boolean;
    pageOptions: PageOptions;
    sortOptions: SortOptions;
    totalItems: number;
} & DispatchProp;

type State = {
    editVisible: boolean;
};

class MemberList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editVisible: false
        };
    }

    componentDidMount() {
        if (this.props.members.length === 0) this.loadMembers();
    }

    componentDidUpdate(prevProps: Props) {
        if (
            prevProps.pageOptions != this.props.pageOptions ||
            prevProps.sortOptions != this.props.sortOptions
        )
            this.loadMembers();
    }

    loadMembers = () => {
        this.props.dispatch(
            fetchMembers(this.props.pageOptions, this.props.sortOptions)
        );
    };

    newMember = () => {
        const member: MemberEdit = {
            id: null,
            firstName: '',
            lastName: '',
            maidenName: '',
            idNumber: '',
            initials: '',
            preferredName: ''
        };

        this.props.dispatch(receiveMember(member));
        this.showEditMember();
    };

    editMember = (id: string) => {
        this.props.dispatch(fetchMember(id));
        this.showEditMember();
    };

    showEditMember = () => {
        this.setState({
            editVisible: true
        });
    };

    closeEditMember = (cancelled: boolean) => {
        this.setState({
            editVisible: false
        });
        if (!cancelled) this.loadMembers();
    };

    getColumns = () => {
        return [
            getColumn('firstName', 'First Name'),
            getColumn('lastName', 'Last Name')
        ];
    };

    onTableChange = (pageOptions: PageOptions, sortOptions: SortOptions) => {
        if (this.props.pageOptions != pageOptions)
            this.props.dispatch(receivePageOptions(pageOptions));
        if (this.props.sortOptions != sortOptions)
            this.props.dispatch(receiveSortOptions(sortOptions));
    };

    render() {
        return (
            <>
                <Header
                    actions={
                        <Button
                            type="default"
                            icon="plus"
                            onClick={this.newMember}
                            disabled={this.props.fetching}
                        >
                            New Member
                        </Button>
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
                <EditMember
                    visible={this.state.editVisible}
                    onClose={this.closeEditMember}
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
        totalItems: membersState.totalItems
    };
};

export default connect(mapStateToProps)(MemberList);

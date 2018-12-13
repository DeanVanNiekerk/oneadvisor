import { Tag } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import {
    fetchMember, fetchMembers, Member, MemberEdit, membersSelector, receiveMember
} from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';
import { getColumn } from '@/state/utils';
import { Button, Header, Table } from '@/ui/controls';

import EditMember from './EditMember';

type Props = {
    members: Member[];
    fetching: boolean;
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

    loadMembers = () => {
        this.props.dispatch(fetchMembers());
    };

    newMember = () => {
        const member: MemberEdit = {
            id: '',
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
        fetching: membersState.fetching
    };
};

export default connect(mapStateToProps)(MemberList);

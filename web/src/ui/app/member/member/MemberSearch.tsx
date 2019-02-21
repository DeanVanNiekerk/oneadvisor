import { Icon, Input } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { applyLike } from '@/app/query';
import { getColumn } from '@/app/table';
import { Member, memberSearchSelector, searchMembers } from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';
import { Table } from '@/ui/controls';

type Props = {
    members: Member[];
    fetching: boolean;
    onSelect: (memberId: string) => void;
    defaultSearchText?: string;
} & DispatchProp;

type State = {
    searchText: string;
};

class MemberSearch extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            searchText: props.defaultSearchText || ''
        };
    }

    componentDidMount() {
        this.loadMembers();
    }

    loadMembers = () => {
        let filters = {
            lastName: [this.state.searchText]
        };

        this.props.dispatch(searchMembers(applyLike(filters, ['lastName'])));
    };

    selectMember = (id: string) => {
        this.props.onSelect(id);
    };

    onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchText: e.target.value }, this.loadMembers);
    };

    getColumns = () => {
        return [
            getColumn('lastName', 'Last Name', { sorter: false }),
            getColumn('firstName', 'First Name', { sorter: false }),
            getColumn('idNumber', 'ID Number', { sorter: false }),
            getColumn('dateOfBirth', 'Date of Birth', {
                type: 'date',
                sorter: false
            })
        ];
    };

    render() {
        const { searchText } = this.state;

        return (
            <>
                <Input
                    autoFocus={true}
                    size="large"
                    placeholder="Last Name"
                    prefix={<Icon type="search" />}
                    allowClear={true}
                    value={searchText}
                    onChange={this.onSearchChange}
                    className="mb-1"
                />
                <Table
                    rowKey="id"
                    columns={this.getColumns()}
                    dataSource={this.props.members}
                    loading={this.props.fetching}
                    onRowClick={member => this.selectMember(member.id)}
                    hidePagination={true}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const membersState = memberSearchSelector(state);

    return {
        members: membersState.items,
        fetching: membersState.fetching
    };
};

export default connect(mapStateToProps)(MemberSearch);

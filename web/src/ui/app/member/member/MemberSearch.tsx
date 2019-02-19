import { Icon, Input, List } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { applyLike } from '@/app/query';
import { debounce } from '@/app/utils';
import { Member, memberSearchSelector, searchMembers } from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';

type Props = {
    members: Member[];
    fetching: boolean;
    onSelect: (memberId: string) => void;
} & DispatchProp;

type State = {
    searchText: string;
};

class MemberSearch extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            searchText: ''
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
                <List
                    loading={this.props.fetching}
                    size="small"
                    bordered
                    dataSource={this.props.members}
                    renderItem={(member: Member) => (
                        <List.Item
                            className="clickable"
                            onClick={() => this.selectMember(member.id)}
                        >{`${member.firstName || ''} ${member.lastName ||
                            ''}`}</List.Item>
                    )}
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

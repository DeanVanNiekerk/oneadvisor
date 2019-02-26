import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getMember, MemberEdit } from '@/state/app/member/members';

type Props = {
    memberId: string | null;
    className?: string;
} & DispatchProp;

type State = {
    member: MemberEdit | null;
};

class MemberNameComponent extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = { member: null };
        this.loadMember();
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.memberId != prevProps.memberId) this.loadMember();
    }

    loadMember = () => {
        if (!this.props.memberId) {
            this.setState({ member: null });
            return;
        }

        this.props.dispatch(
            getMember(this.props.memberId, (member: MemberEdit) => {
                this.setState({ member: member });
            })
        );
    };

    render() {
        const { member } = this.state;

        if (!member) return <span />;

        return (
            <span className={this.props.className}>{`${member.firstName ||
                ''} ${member.lastName || ''}`}</span>
        );
    }
}

const MemberName = connect()(MemberNameComponent);

export { MemberName };

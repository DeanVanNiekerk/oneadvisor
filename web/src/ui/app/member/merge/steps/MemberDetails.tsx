import { Alert, Divider } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Result } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import {
    insertMember, Member, MemberEdit, memberMergeNextStep, memberMergePreviousStep, memberMergeSelector, memberSelector,
    receiveMember, receiveMemberMergeInserted
} from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';

import MemberForm from '../../member/MemberForm';
import MemberMergeSteps from '../MemberMergeSteps';

type Props = {
    member: MemberEdit | null;
    members: Member[];
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    memberEdited: MemberEdit | null;
};

class MemberDetails extends Component<Props, State> {
    constructor(props) {
        super(props);

        this.state = {
            memberEdited: null,
        };
    }

    componentDidMount() {
        const member = this.mergeMembers(this.props.members);
        this.props.dispatch(receiveMember(member));
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.members != prevProps.members) {
            const member = this.mergeMembers(this.props.members);
            this.props.dispatch(receiveMember(member));
        }
        if (this.props.member != prevProps.member) {
            this.setState({
                memberEdited: this.props.member,
            });
        }
    }

    onChange = (member: MemberEdit) => {
        this.setState({
            memberEdited: member,
        });
    };

    mergeMembers = (members: Member[]): Member => {
        const member = members[0];
        members.forEach(m => {
            for (let property in m) {
                const value = m[property];
                if (value != undefined && value != null && value != "")
                    member[property] = value;
            }
        });
        return member;
    };

    insertNewMember = () => {
        if (!this.state.memberEdited) {
            return;
        }

        this.props.dispatch(
            insertMember(
                this.state.memberEdited,
                //Success
                (result: Result) => {
                    this.props.dispatch(receiveMemberMergeInserted(result.tag));
                    this.props.dispatch(memberMergeNextStep());
                }
            )
        );
    };

    render() {
        return (
            <>
                <MemberMergeSteps
                    onNext={() => this.insertNewMember()}
                    nextIcon="fork"
                    nextText="Merge"
                    onPrevious={() =>
                        this.props.dispatch(memberMergePreviousStep())
                    }
                />

                <Divider />

                <Alert
                    message="Before merging, please confirm that you are happy with the merged member details."
                    type="info"
                    showIcon
                    className="mb-1"
                />

                {this.props.member && (
                    <MemberForm
                        member={this.props.member}
                        validationResults={this.props.validationResults}
                        onChange={this.onChange}
                    />
                )}
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const mergeState = memberMergeSelector(state);
    const memberState = memberSelector(state);

    return {
        members: mergeState.members,
        member: memberState.member,
        validationResults: memberState.validationResults,
    };
};

export default connect(mapStateToProps)(MemberDetails);

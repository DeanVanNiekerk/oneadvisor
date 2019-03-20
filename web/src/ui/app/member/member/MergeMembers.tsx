import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { Result } from '@/app/types';
import { areEqual } from '@/app/utils';
import { ValidationResult } from '@/app/validation';
import { insertMember, MemberEdit, memberSelector, receiveMember, updateMember } from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';
import { showConfirm } from '@/ui/feedback/modal/confirm';

import MemberForm from './MemberForm';

type Props = {
    onClose?: (cancelled: boolean) => void;
    onMemberInserted?: (member: MemberEdit) => void;
    member: MemberEdit | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
} & DispatchProp;

type State = {
    memberEdited: MemberEdit | null;
};
class MergeMembers extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            memberEdited: props.member,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.member != prevProps.member) {
            this.setState({
                memberEdited: this.props.member,
            });
        }
    }

    close = (cancelled: boolean = false) => {
        this.props.dispatch(receiveMember(null));
        if (this.props.onClose) this.props.onClose(cancelled);
    };

    confirmCancel = () => {
        if (!areEqual(this.props.member, this.state.memberEdited))
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.close(true);
    };

    save = () => {
        if (!this.state.memberEdited) {
            this.close();
            return;
        }

        if (this.state.memberEdited.id) {
            this.props.dispatch(
                updateMember(this.state.memberEdited, () => this.close())
            );
        } else {
            this.props.dispatch(
                insertMember(this.state.memberEdited, (result: Result) => {
                    if (this.props.onMemberInserted)
                        this.props.onMemberInserted(result.tag as MemberEdit);
                    this.close();
                })
            );
        }
    };

    onChange = (member: MemberEdit) => {
        this.setState({
            memberEdited: member,
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    getTitle = () => {
        if (this.props.fetching) return "Loading Member";

        const { member } = this.props;

        if (member && member.id)
            return `Member: ${member.firstName} ${member.lastName}`;

        return "New Member";
    };

    render() {
        const { member, fetching, validationResults } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                icon="profile"
                visible={!!member || fetching}
                onClose={this.confirmCancel}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {member && (
                        <MemberForm
                            member={member}
                            validationResults={validationResults}
                            onChange={this.onChange}
                        />
                    )}
                </ContentLoader>
                <DrawerFooter>
                    <Button
                        onClick={this.confirmCancel}
                        disabled={this.isLoading()}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={this.save}
                        type="primary"
                        disabled={this.isLoading()}
                        requiredUseCase="mem_edit_members"
                    >
                        Save
                    </Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    //const memberState = memberSelector(state);

    return {
        // member: memberState.member,
        // fetching: memberState.fetching,
        // updating: memberState.updating,
        // validationResults: memberState.validationResults
    };
};

export default connect(mapStateToProps)(MergeMembers);

import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { ValidationResult } from '@/app/validation';
import {
    fetchUserSimple, receiveUserSimple, UserSimple, userSimpleIsIdentity, userSimpleSelector
} from '@/state/app/directory/usersSimple';
import { insertMember, MemberEdit, memberSelector, updateMember } from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';
import { Button, ContentLoader, Drawer, DrawerFooter } from '@/ui/controls';
import { showConfirm } from '@/ui/feedback/modal/confirm';

import MemberForm from './MemberForm';

type Props = {
    visible: boolean;
    onClose: (cancelled: boolean) => void;
    member: MemberEdit | null;
    fetching: boolean;
    updating: boolean;
    validationResults: ValidationResult[];
    user: UserSimple | null;
    enabled: boolean;
} & RouteComponentProps &
    DispatchProp;

type State = {
    memberEdited: MemberEdit | null;
};
class EditMember extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            memberEdited: props.member
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.member != prevProps.member) {
            if (this.props.member)
                this.props.dispatch(fetchUserSimple(this.props.member.userId));

            this.setState({
                memberEdited: this.props.member
            });
        }
    }

    close = () => {
        this.props.onClose(false);
    };

    confirmCancel = () => {
        if (this.props.member != this.state.memberEdited)
            return showConfirm({ onOk: this.cancel });

        this.cancel();
    };

    cancel = () => {
        this.props.onClose(true);
    };

    save = () => {
        if (!this.state.memberEdited) {
            this.close();
            return;
        }

        if (this.state.memberEdited.id) {
            this.props.dispatch(
                updateMember(this.state.memberEdited, this.close)
            );
        } else {
            this.props.dispatch(
                insertMember(this.state.memberEdited, this.close)
            );
        }
    };

    onChange = (member: MemberEdit) => {
        this.setState({
            memberEdited: member
        });
    };

    isLoading = () => {
        return this.props.fetching || this.props.updating;
    };

    getTitle = () => {
        if (this.props.fetching) return 'Loading Member';

        const { member } = this.props;

        if (member && member.id)
            return `Edit Member: ${member.firstName} ${member.lastName}`;

        return 'New Member';
    };

    render() {
        const { member, validationResults, visible } = this.props;

        return (
            <Drawer
                title={this.getTitle()}
                visible={visible}
                onClose={this.confirmCancel}
            >
                <ContentLoader isLoading={this.isLoading()}>
                    {member && (
                        <MemberForm
                            member={member}
                            validationResults={validationResults}
                            onChange={this.onChange}
                            user={this.props.user}
                            enabled={this.props.enabled}
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
                        visible={this.props.enabled}
                    >
                        Save
                    </Button>
                </DrawerFooter>
            </Drawer>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const memberState = memberSelector(state);
    const userState = userSimpleSelector(state);

    return {
        member: memberState.member,
        fetching: memberState.fetching || userState.fetching,
        updating: memberState.updating,
        validationResults: memberState.validationResults,
        enabled: userSimpleIsIdentity(state),
        user: userState.userSimple
    };
};

export default withRouter(connect(mapStateToProps)(EditMember));

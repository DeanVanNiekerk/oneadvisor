import { Card, Col, Icon, Row, Skeleton } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { hasUseCase } from '@/app/identity';
import { identitySelector } from '@/state/app/directory/identity';
import { fetchMember, fetchMemberPreview, MemberPreview, memberPreviewSelector } from '@/state/app/member/members';
import { newPolicy, receivePolicy } from '@/state/app/member/policies';
import { RootState } from '@/state/rootReducer';
import {
    Age, Button, Drawer, DrawerFooter, Header, PreviewCard, PreviewCardContainer, PreviewCardRow
} from '@/ui/controls';

import ContactList from '../contact/ContactList';
import EditPolicy from '../policy/EditPolicy';
import PolicyList from '../policy/PolicyList';
import EditMember from './EditMember';

type Props = {
    member: MemberPreview | null;
    fetching: boolean;
    useCases: string[];
} & RouteComponentProps<{ memberId: string }> &
    DispatchProp;

type State = {
    policyListVisible: boolean;
    contactListVisible: boolean;
};

class MemberPreviewComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            policyListVisible: false,
            contactListVisible: false
        };
    }

    componentDidMount() {
        this.load();
    }

    togglePolicyListVisible = () => {
        this.setState({
            policyListVisible: !this.state.policyListVisible
        });
    };

    toggleContactListVisible = () => {
        this.setState({
            contactListVisible: !this.state.contactListVisible
        });
    };

    newPolicy = () => {
        const policy = newPolicy(this.getMemberId());
        this.props.dispatch(receivePolicy(policy));
    };

    getMemberId = () => {
        return this.props.match.params.memberId;
    };

    load = () => {
        this.props.dispatch(fetchMemberPreview(this.getMemberId()));
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) this.load();
    };

    editDetails = () => {
        this.props.dispatch(fetchMember(this.getMemberId()));
    };

    isLoading = () => {
        return this.props.fetching;
    };

    getPolicyActions = () => {
        const actions = [
            <Icon type="bars" onClick={this.togglePolicyListVisible} />
        ];

        if (hasUseCase('mem_edit_policies', this.props.useCases))
            actions.unshift(
                <Icon
                    type="plus"
                    onClick={e => {
                        e.stopPropagation();
                        this.newPolicy();
                    }}
                />
            );

        return actions;
    };

    render() {
        let { member } = this.props;

        return (
            <>
                <Header loading={this.isLoading()}>
                    {`${member && member.firstName} ${member &&
                        member.lastName}`}
                </Header>

                <PreviewCardContainer>
                    <PreviewCard
                        title="Details"
                        icon="profile"
                        onClick={this.editDetails}
                        isLoading={this.isLoading()}
                        actions={[
                            <Icon type="edit" onClick={this.editDetails} />
                        ]}
                        rows={2}
                    >
                        {member && (
                            <>
                                <PreviewCardRow
                                    label="Id"
                                    value={`${
                                        member.idNumber ? member.idNumber : ''
                                    }`}
                                />
                                <PreviewCardRow
                                    label="Age"
                                    value={
                                        <Age dateOfBirth={member.dateOfBirth} />
                                    }
                                />
                            </>
                        )}
                    </PreviewCard>
                    <PreviewCard
                        title="Policies"
                        icon="file-text"
                        onClick={this.togglePolicyListVisible}
                        isLoading={this.isLoading()}
                        requiredUseCase="mem_view_policies"
                        actions={this.getPolicyActions()}
                    >
                        {member && (
                            <>
                                <PreviewCardRow
                                    label="Policies"
                                    value={`${member.policyCount}`}
                                />
                                <PreviewCardRow
                                    label=""
                                    value={<span>&nbsp;</span>}
                                />
                            </>
                        )}
                    </PreviewCard>
                    <PreviewCard
                        title="Contacts"
                        icon="phone"
                        onClick={this.toggleContactListVisible}
                        isLoading={this.isLoading()}
                        requiredUseCase="mem_view_contacts"
                        actions={[
                            <Icon
                                type="bars"
                                onClick={this.toggleContactListVisible}
                            />
                        ]}
                    >
                        {member && (
                            <>
                                <PreviewCardRow
                                    label="Contacts"
                                    value={`${member.contactCount}`}
                                />
                                <PreviewCardRow
                                    label=""
                                    value={<span>&nbsp;</span>}
                                />
                            </>
                        )}
                    </PreviewCard>
                </PreviewCardContainer>

                <EditMember onClose={this.onFormClose} />
                <EditPolicy onClose={this.onFormClose} />

                <Drawer
                    title="Policies"
                    icon="file-text"
                    noTopPadding={true}
                    visible={this.state.policyListVisible}
                    onClose={this.togglePolicyListVisible}
                >
                    <PolicyList memberId={this.getMemberId()} />
                    <DrawerFooter>
                        <Button onClick={this.togglePolicyListVisible}>
                            Close
                        </Button>
                    </DrawerFooter>
                </Drawer>

                <Drawer
                    title="Contacts"
                    icon="phone"
                    noTopPadding={true}
                    visible={this.state.contactListVisible}
                    onClose={this.toggleContactListVisible}
                >
                    <ContactList
                        memberId={this.getMemberId()}
                        onSave={this.load}
                    />
                    <DrawerFooter>
                        <Button onClick={this.toggleContactListVisible}>
                            Close
                        </Button>
                    </DrawerFooter>
                </Drawer>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const memberState = memberPreviewSelector(state);
    const identityState = identitySelector(state);

    return {
        member: memberState.member,
        fetching: memberState.fetching,
        useCases: identityState.identity
            ? identityState.identity.useCaseIds
            : []
    };
};

export default withRouter(connect(mapStateToProps)(MemberPreviewComponent));

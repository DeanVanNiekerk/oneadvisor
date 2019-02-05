import { Card, Col, Icon, Row, Skeleton } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { hasUseCase } from '@/app/identity';
import {
    fetchStatement, fetchStatementPreview, Statement, statementPreviewSelector
} from '@/state/app/commission/statements';
import { identitySelector } from '@/state/app/directory/identity';
import { RootState } from '@/state/rootReducer';
import { Drawer, DrawerFooter, Header, PreviewCard, PreviewCardContainer } from '@/ui/controls';

import EditStatement from './EditStatement';

type Props = {
    statement: Statement | null;
    fetching: boolean;
    useCases: string[];
} & RouteComponentProps<{ commissionStatementId: string }> &
    DispatchProp;

type State = {
    // policyListVisible: boolean;
    // contactListVisible: boolean;
};

class StatementPreviewComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            // policyListVisible: false,
            // contactListVisible: false
        };
    }

    componentDidMount() {
        this.load();
    }

    // togglePolicyListVisible = () => {
    //     this.setState({
    //         policyListVisible: !this.state.policyListVisible
    //     });
    // };

    // toggleContactListVisible = () => {
    //     this.setState({
    //         contactListVisible: !this.state.contactListVisible
    //     });
    // };

    // newPolicy = () => {
    //     const policy = newPolicy(this.getMemberId());
    //     this.props.dispatch(receivePolicy(policy));
    // };

    getCommissionStatementId = () => {
        return this.props.match.params.commissionStatementId;
    };

    load = () => {
        this.props.dispatch(
            fetchStatementPreview(this.getCommissionStatementId())
        );
    };

    onFormClose = (cancelled: boolean) => {
        if (!cancelled) this.load();
    };

    editDetails = () => {
        this.props.dispatch(fetchStatement(this.getCommissionStatementId()));
    };

    isLoading = () => {
        return this.props.fetching;
    };

    // getPolicyActions = () => {
    //     const actions = [
    //         <Icon type="bars" onClick={this.togglePolicyListVisible} />
    //     ];

    //     if (hasUseCase('mem_edit_policies', this.props.useCases))
    //         actions.unshift(
    //             <Icon
    //                 type="plus"
    //                 onClick={e => {
    //                     e.stopPropagation();
    //                     this.newPolicy();
    //                 }}
    //             />
    //         );

    //     return actions;
    // };

    render() {
        let { statement } = this.props;

        return (
            <>
                <Header loading={this.isLoading()}>
                    {statement && statement.date}
                </Header>

                <PreviewCardContainer>
                    <Row gutter={16}>
                        <PreviewCard
                            title="Details"
                            onClick={this.editDetails}
                            isLoading={this.isLoading()}
                            actions={[
                                <Icon type="edit" onClick={this.editDetails} />
                            ]}
                        >
                            <div>{statement && statement.date}</div>
                        </PreviewCard>
                        {/* <PreviewCard
                            title="Policies"
                            onClick={this.togglePolicyListVisible}
                            isLoading={this.isLoading()}
                            requiredUseCase="mem_view_policies"
                            actions={this.getPolicyActions()}
                        >
                            <span>
                                Total Policies: {member && member.policyCount}
                            </span>
                        </PreviewCard>
                        <PreviewCard
                            title="Contacts"
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
                            <span>
                                Total Contacts: {member && member.contactCount}
                            </span>
                        </PreviewCard> */}
                    </Row>
                </PreviewCardContainer>

                <EditStatement onClose={this.onFormClose} />

                {/* <Drawer
                    title="Policies"
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
                </Drawer> */}
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const statementState = statementPreviewSelector(state);
    const identityState = identitySelector(state);

    return {
        statement: statementState.statement,
        fetching: statementState.fetching,
        useCases: identityState.identity
            ? identityState.identity.useCaseIds
            : []
    };
};

export default withRouter(connect(mapStateToProps)(StatementPreviewComponent));

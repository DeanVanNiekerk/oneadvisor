import { Card, Col, Icon, Row, Skeleton } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { fetchMember, fetchMemberPreview, MemberPreview, memberPreviewSelector } from '@/state/app/member/members';
import { newPolicy, receivePolicy } from '@/state/app/member/policies';
import { RootState } from '@/state/rootReducer';
import { Age, Button, Drawer, DrawerFooter, Header } from '@/ui/controls';

import EditPolicy from '../policy/EditPolicy';
import PolicyList from '../policy/PolicyList';
import EditMember from './EditMember';

type Props = {
    member: MemberPreview | null;
    fetching: boolean;
} & RouteComponentProps<{ memberId: string }> &
    DispatchProp;

type State = {
    policyListVisible: boolean;
};

class MemberPreviewView extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            policyListVisible: false
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

    render() {
        let { member } = this.props;

        return (
            <>
                <Header loading={this.isLoading()}>
                    {`${member && member.firstName} ${member &&
                        member.lastName}`}
                </Header>

                <div style={{ background: '#ECECEC', padding: '30px' }}>
                    <Row gutter={16}>
                        <Col span={4}>
                            <Card
                                hoverable={true}
                                title="Details"
                                bordered={false}
                                onClick={this.editDetails}
                                actions={[
                                    <Icon
                                        type="edit"
                                        onClick={this.editDetails}
                                    />
                                ]}
                            >
                                <Skeleton
                                    loading={this.isLoading()}
                                    title={false}
                                    active
                                    paragraph={{
                                        rows: 1
                                    }}
                                >
                                    <div>
                                        {`${member &&
                                            member.firstName} ${member &&
                                            member.lastName}`}
                                        {member && member.dateOfBirth && (
                                            <span>
                                                <span>, </span>
                                                <Age
                                                    dateOfBirth={
                                                        member.dateOfBirth
                                                    }
                                                />
                                            </span>
                                        )}
                                    </div>
                                </Skeleton>
                            </Card>
                        </Col>
                        <Col span={4}>
                            <Card
                                hoverable={true}
                                title="Policies"
                                bordered={false}
                                onClick={this.togglePolicyListVisible}
                                actions={[
                                    <Icon
                                        type="plus"
                                        onClick={e => {
                                            e.stopPropagation();
                                            this.newPolicy();
                                        }}
                                    />,
                                    <Icon
                                        type="bars"
                                        onClick={this.togglePolicyListVisible}
                                    />
                                ]}
                            >
                                <Skeleton
                                    loading={this.isLoading()}
                                    title={false}
                                    active
                                    paragraph={{
                                        rows: 1
                                    }}
                                >
                                    <span>
                                        Total Policies:{' '}
                                        {member && member.policyCount}
                                    </span>
                                </Skeleton>
                            </Card>
                        </Col>
                    </Row>
                </div>

                <EditMember onClose={this.onFormClose} />
                <EditPolicy onClose={this.onFormClose} />

                <Drawer
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
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const memberState = memberPreviewSelector(state);

    return {
        member: memberState.member,
        fetching: memberState.fetching
    };
};

export default withRouter(connect(mapStateToProps)(MemberPreviewView));

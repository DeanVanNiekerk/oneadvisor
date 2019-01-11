import { Card, Col, Icon, Row, Skeleton } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { fetchMember, fetchMemberPreview, MemberPreview, memberPreviewSelector } from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';
import { Age, Header } from '@/ui/controls';

import EditMember from './EditMember';

type Props = {
    member: MemberPreview | null;
    fetching: boolean;
} & RouteComponentProps<{ memberId: string }> &
    DispatchProp;

class MemberPreviewView extends Component<Props> {
    constructor(props: Props) {
        super(props);

        this.state = {
            memberEdited: props.member
        };
    }

    componentDidMount() {
        this.load();
    }

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
                <Header>{`${member && member.firstName} ${member &&
                    member.lastName}`}</Header>

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
                                actions={[
                                    <Icon type="plus" />,
                                    <Icon type="bars" />
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

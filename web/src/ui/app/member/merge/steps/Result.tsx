import { Alert, Divider } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { MemberEdit, memberMergeSelector } from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';
import { Button } from '@/ui/controls';

import MemberMergeSteps from '../MemberMergeSteps';

type Props = {
    insertedMember: MemberEdit;
} & DispatchProp &
    RouteComponentProps;

class Result extends Component<Props> {
    preview = () => {
        this.props.history.push(
            `/member/members/${this.props.insertedMember.id}`
        );
    };

    render() {
        return (
            <>
                <MemberMergeSteps />

                <Divider />

                <Alert
                    message="Members have been successfully merged."
                    type="success"
                    showIcon
                    className="mb-1"
                />

                <Button
                    icon="user"
                    onClick={this.preview}
                    type="primary"
                    noLeftMargin={true}
                >
                    Preview Merged Member
                </Button>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const mergeState = memberMergeSelector(state);

    return {
        insertedMember: mergeState.insertedMember,
    };
};

export default withRouter(connect(mapStateToProps)(Result));

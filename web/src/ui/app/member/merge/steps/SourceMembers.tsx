import { Alert, Divider, Icon, List, Upload as UploadAD } from 'antd';
import React, { Component } from 'react';
import { connect, DispatchProp } from 'react-redux';

import { getAge } from '@/app/utils';
import { memberImportTableRowsSelector } from '@/state/app/member/import';
import { Member, memberMergeNextStep, memberMergeSelector } from '@/state/app/member/members';
import { RootState } from '@/state/rootReducer';

import MemberMergeSteps from '../MemberMergeSteps';

type Props = {
    members: Member[];
} & DispatchProp;

class SourceMembers extends Component<Props> {
    memberFullName = (member: Member): string => {
        const parts: string[] = [];

        if (member.lastName) parts.push(member.lastName);

        if (member.firstName) parts.push(member.firstName);

        if (member.initials) parts.push(member.initials);

        return parts.join(",");
    };

    memberDetails = (member: Member): string => {
        const parts: string[] = [];

        if (member.dateOfBirth)
            parts.push(`Age: ${getAge(member.dateOfBirth)}`);

        if (member.idNumber) parts.push(`ID Number: ${member.idNumber}`);

        if (member.passportNumber)
            parts.push(`Passport Number: ${member.passportNumber}`);

        return parts.join(" | ");
    };

    render() {
        return (
            <>
                <MemberMergeSteps
                    onNext={() => this.props.dispatch(memberMergeNextStep())}
                />

                <Divider />

                <Alert
                    message="Before continuing, please confirm that you do wish to merge all the members below."
                    type="info"
                    showIcon
                    className="mb-1"
                />

                <List
                    itemLayout="horizontal"
                    bordered={true}
                    dataSource={this.props.members}
                    renderItem={(member: Member) => (
                        <List.Item>
                            <List.Item.Meta
                                title={this.memberFullName(member)}
                                description={this.memberDetails(member)}
                            />
                        </List.Item>
                    )}
                />
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const mergeState = memberMergeSelector(state);

    return {
        members: mergeState.members,
    };
};

export default connect(mapStateToProps)(SourceMembers);

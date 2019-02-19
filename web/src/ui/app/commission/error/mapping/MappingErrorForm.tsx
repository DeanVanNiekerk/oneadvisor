import React, { Component } from 'react';
import JSONPretty from 'react-json-pretty';
import { connect, DispatchProp } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import { CommissionError } from '@/state/app/commission/errors';
import { MemberEdit, newMember, receiveMember } from '@/state/app/member/members';
import EditMember from '@/ui/app/member/member/EditMember';
import MemberSearch from '@/ui/app/member/member/MemberSearch';
import { Button, Drawer, DrawerFooter, Form, FormText } from '@/ui/controls';

type Props = {
    error: CommissionError;
    validationResults: ValidationResult[];
    onChange: (error: CommissionError) => void;
} & DispatchProp;

type State = {
    error: CommissionError;
    searchMemberVisible: boolean;
};

class MappingErrorForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            error: props.error,
            searchMemberVisible: false
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.error != prevProps.error) {
            this.setState({
                error: this.props.error
            });
        }
    }

    handleChange = (fieldName: string, value: any) => {
        const error = {
            ...this.state.error,
            [fieldName]: value
        };
        this.setState({
            error: error
        });
        this.props.onChange(error);
    };

    newMember = () => {
        const member = newMember();
        this.props.dispatch(receiveMember(member));
    };

    memberInserted = (member: MemberEdit) => {
        this.selectMember(member.id || '');
    };

    selectMember = (memberId: string) => {
        this.handleChange('memberId', memberId);
    };

    toggleSearchMemberVisible = () => {
        this.setState({
            searchMemberVisible: !this.state.searchMemberVisible
        });
    };

    render() {
        const { validationResults } = this.props;
        const { error } = this.state;

        return (
            <>
                <Form editUseCase="com_edit_commission_statements">
                    <FormText
                        fieldName="memberId"
                        label="Member"
                        value={error.memberId || 'No Mapped Member'}
                        validationResults={validationResults}
                        extra={
                            <>
                                <Button
                                    size="small"
                                    icon="search"
                                    onClick={this.toggleSearchMemberVisible}
                                >
                                    Find Member
                                </Button>
                                <Button
                                    size="small"
                                    icon="plus"
                                    onClick={this.newMember}
                                >
                                    New Member
                                </Button>
                            </>
                        }
                    />
                    <FormText
                        fieldName="policyId"
                        label="Policy"
                        value={error.policyId || ''}
                        validationResults={validationResults}
                    />
                </Form>
                <h4>Raw Data</h4>
                <JSONPretty json={JSON.parse(error.data)} />
                <EditMember onMemberInserted={this.memberInserted} />

                <Drawer
                    title="Member Search"
                    visible={this.state.searchMemberVisible}
                    onClose={this.toggleSearchMemberVisible}
                >
                    <MemberSearch
                        onSelect={(memberId: string) => {
                            this.selectMember(memberId);
                            this.toggleSearchMemberVisible();
                        }}
                    />
                    <DrawerFooter>
                        <Button onClick={this.toggleSearchMemberVisible}>
                            Close
                        </Button>
                    </DrawerFooter>
                </Drawer>
            </>
        );
    }
}

export default connect()(MappingErrorForm);

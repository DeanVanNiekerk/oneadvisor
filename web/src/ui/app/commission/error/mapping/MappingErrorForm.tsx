import React, { Component } from 'react';
import JSONPretty from 'react-json-pretty';
import { connect, DispatchProp } from 'react-redux';

import { ValidationResult } from '@/app/validation';
import { CommissionError, CommissionErrorData } from '@/state/app/commission/errors';
import { Statement } from '@/state/app/commission/statements';
import { MemberEdit, newMember, receiveMember } from '@/state/app/member/members';
import { newPolicy, PolicyEdit, receivePolicy } from '@/state/app/member/policies';
import EditMember from '@/ui/app/member/member/EditMember';
import MemberSearch from '@/ui/app/member/member/MemberSearch';
import EditPolicy from '@/ui/app/member/policy/EditPolicy';
import PolicySearch from '@/ui/app/member/policy/PolicySearch';
import {
    Button, CommissionTypeName, Drawer, DrawerFooter, Form, FormText, MemberName, PolicyName, TabPane, Tabs
} from '@/ui/controls';

type Props = {
    statement: Statement;
    error: CommissionError;
    validationResults: ValidationResult[];
    onChange: (error: CommissionError) => void;
} & DispatchProp;

type State = {
    error: CommissionError;
    errorData: CommissionErrorData;
    searchMemberVisible: boolean;
    searchPolicyVisible: boolean;
    activeTab: TabKey;
};

type TabKey = 'form_tab' | 'data_tab';

class MappingErrorForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            error: props.error,
            errorData: JSON.parse(props.error.data),
            searchMemberVisible: false,
            searchPolicyVisible: false,
            activeTab: 'form_tab'
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.error != prevProps.error) {
            this.setState({
                error: this.props.error,
                errorData: JSON.parse(this.props.error.data),
                activeTab: 'form_tab'
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
        const { errorData } = this.state;

        const member = newMember({
            firstName: errorData.FirstName,
            lastName: errorData.LastName,
            dateOfBirth: errorData.DateOfBirth,
            idNumber: errorData.IdNumber,
            initials: errorData.Initials
        });
        this.props.dispatch(receiveMember(member));
    };

    newPolicy = () => {
        if (!this.state.error.memberId) return;

        const policy = newPolicy({
            memberId: this.state.error.memberId,
            companyId: this.props.statement.companyId,
            number: this.state.errorData.PolicyNumber
        });
        this.props.dispatch(receivePolicy(policy));
    };

    memberInserted = (member: MemberEdit) => {
        this.selectMember(member.id);
    };

    policyInserted = (policy: PolicyEdit) => {
        this.selectPolicy(policy.id);
    };

    selectMember = (memberId: string) => {
        //If the member changes clear the policy
        if (memberId != this.state.error.memberId) this.selectPolicy(null);

        this.handleChange('memberId', memberId);
    };

    selectPolicy = (policyId: string | null) => {
        this.handleChange('policyId', policyId);
    };

    toggleSearchMemberVisible = () => {
        this.setState({
            searchMemberVisible: !this.state.searchMemberVisible
        });
    };

    toggleSearchPolicyVisible = () => {
        this.setState({
            searchPolicyVisible: !this.state.searchPolicyVisible
        });
    };

    onTabChange = (activeTab: TabKey) => {
        this.setState({ activeTab });
    };

    render() {
        const { validationResults } = this.props;
        const { error } = this.state;

        return (
            <>
                <Tabs
                    onChange={this.onTabChange}
                    activeKey={this.state.activeTab}
                    sticky={true}
                >
                    <TabPane tab="Mapping" key="form_tab">
                        <Form editUseCase="com_edit_commission_statements">
                            <FormText
                                fieldName="memberId"
                                label="Member"
                                value={
                                    error.memberId ? (
                                        <MemberName memberId={error.memberId} />
                                    ) : null
                                }
                                emptyValueText="No Mapped Member"
                                validationResults={validationResults}
                                extra={
                                    <>
                                        <Button
                                            size="small"
                                            icon="search"
                                            onClick={
                                                this.toggleSearchMemberVisible
                                            }
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
                                value={
                                    error.policyId ? (
                                        <PolicyName policyId={error.policyId} />
                                    ) : null
                                }
                                emptyValueText="No Mapped Policy"
                                validationResults={validationResults}
                                extra={
                                    <>
                                        <Button
                                            size="small"
                                            icon="search"
                                            onClick={
                                                this.toggleSearchPolicyVisible
                                            }
                                            disabled={
                                                !this.state.error.memberId
                                            }
                                        >
                                            Find Policy
                                        </Button>
                                        <Button
                                            size="small"
                                            icon="plus"
                                            onClick={this.newPolicy}
                                            disabled={
                                                !this.state.error.memberId
                                            }
                                        >
                                            New Policy
                                        </Button>
                                    </>
                                }
                            />
                            <FormText
                                fieldName="commissionTypeId"
                                label="Commission Type"
                                value={
                                    error.commissionTypeId ? (
                                        <CommissionTypeName
                                            commissionTypeId={
                                                error.commissionTypeId
                                            }
                                        />
                                    ) : null
                                }
                                emptyValueText="No Mapped Commission Type"
                                validationResults={validationResults}
                            />
                        </Form>
                    </TabPane>

                    <TabPane tab="Excel Data" key="data_tab">
                        <JSONPretty json={JSON.parse(error.data)} />
                    </TabPane>
                </Tabs>

                <EditMember onMemberInserted={this.memberInserted} />
                <EditPolicy onPolicyInserted={this.policyInserted} />

                <Drawer
                    title="Member Search"
                    visible={this.state.searchMemberVisible}
                    onClose={this.toggleSearchMemberVisible}
                >
                    <MemberSearch
                        defaultSearchText={this.state.errorData.LastName || ''}
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

                <Drawer
                    title="Policy Search"
                    visible={this.state.searchPolicyVisible}
                    onClose={this.toggleSearchPolicyVisible}
                >
                    <PolicySearch
                        onSelect={(policyId: string) => {
                            this.selectPolicy(policyId);
                            this.toggleSearchPolicyVisible();
                        }}
                        memberId={this.state.error.memberId}
                        companyId={this.props.statement.companyId}
                    />
                    <DrawerFooter>
                        <Button onClick={this.toggleSearchPolicyVisible}>
                            Close
                        </Button>
                    </DrawerFooter>
                </Drawer>
            </>
        );
    }
}

export default connect()(MappingErrorForm);

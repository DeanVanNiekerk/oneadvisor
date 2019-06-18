import update from 'immutability-helper';
import React, { Component } from 'react';

import { ValidationResult } from '@/app/validation';
import { SplitRulePolicy, SplitRulePolicyInfo } from '@/state/app/commission/splitRulePolicies';
import { SplitRule } from '@/state/app/commission/splitRules';
import { CompanyName, Form, FormSelect, FormText, UserName } from '@/ui/controls';

type Props = {
    splitRulePolicy: SplitRulePolicy;
    splitRulePolicyInfo: SplitRulePolicyInfo;
    splitRules: SplitRule[];
    validationResults: ValidationResult[];
    onChange: (rule: SplitRulePolicy) => void;
};

type State = {
    splitRulePolicy: SplitRulePolicy;
};

class CommissionForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            splitRulePolicy: props.splitRulePolicy,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.splitRulePolicy != prevProps.splitRulePolicy) {
            this.setState({
                splitRulePolicy: this.props.splitRulePolicy,
            });
        }
    }

    handleChange = (fieldName: string, value: any) => {
        const splitRulePolicy = update(this.state.splitRulePolicy, { [fieldName]: { $set: value } });
        this.setState({
            splitRulePolicy: splitRulePolicy,
        });
        this.props.onChange(splitRulePolicy);
    };

    render() {
        const { validationResults, splitRulePolicyInfo } = this.props;
        const { splitRulePolicy } = this.state;

        return (
            <Form editUseCase="com_edit_commission_split_rules">
                <FormText label="Broker" value={<UserName userId={splitRulePolicyInfo.policyUserId} />} />
                <FormText label="Company" value={<CompanyName companyId={splitRulePolicyInfo.policyCompanyId} />} />
                <FormText
                    label="Client"
                    value={`${splitRulePolicyInfo.policyClientFirstName || ""} ${
                        splitRulePolicyInfo.policyClientLastName
                    }`}
                />
                <FormText label="Policy Number" value={splitRulePolicyInfo.policyNumber} />
                <FormSelect
                    fieldName="commissionSplitRuleId"
                    label="Split Rule"
                    value={splitRulePolicy.commissionSplitRuleId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.splitRules}
                    optionsValue="id"
                    optionsText="name"
                    onOptionsText={(rule: SplitRule) => {
                        let text = rule.name;
                        if (rule.isDefault) text = `${text} (Default)`;
                        return text;
                    }}
                />
            </Form>
        );
    }
}

export default CommissionForm;

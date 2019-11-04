import update from "immutability-helper";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { ValidationResult } from "@/app/validation";
import { fetchSplitRulePolicy, SplitRulePolicy, SplitRulePolicyInfo } from "@/state/app/commission/splitRulePolicies";
import { fetchSplitRules, SplitRule, splitRulesSelector } from "@/state/app/commission/splitRules";
import { RootState } from "@/state/rootReducer";
import { Button, CompanyName, Drawer, DrawerFooter, Form, FormSelect, FormText, UserName } from "@/ui/controls";

import SplitRuleList from "../splitRule/SplitRuleList";

type Props = {
    splitRulePolicy: SplitRulePolicy;
    splitRulePolicyInfo: SplitRulePolicyInfo;
    splitRules: SplitRule[];
    validationResults: ValidationResult[];
    onChange: (rule: SplitRulePolicy) => void;
    fetching: boolean;
} & DispatchProp;

type State = {
    splitRulePolicy: SplitRulePolicy;
    manageSplitRulesVisible: boolean;
};

class SplitRulePolicyForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            splitRulePolicy: props.splitRulePolicy,
            manageSplitRulesVisible: false,
        };
    }

    componentDidMount() {
        this.loadSplitRules();
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.splitRulePolicy != prevProps.splitRulePolicy) {
            this.setState({
                splitRulePolicy: this.props.splitRulePolicy,
            });
        }

        if (this.props.splitRulePolicyInfo != prevProps.splitRulePolicyInfo) {
            this.loadSplitRules();
        }
    }

    loadSplitRules = () => {
        const filters = {
            userId: [this.props.splitRulePolicyInfo.policyUserId],
        };
        this.props.dispatch(fetchSplitRules(filters));
    };

    loadSplitRulePolicy = () => {
        this.props.dispatch(fetchSplitRulePolicy(this.props.splitRulePolicyInfo.policyId));
    };

    handleChange = (fieldName: string, value: any) => {
        const splitRulePolicy = update(this.state.splitRulePolicy, { [fieldName]: { $set: value } });
        this.setState({
            splitRulePolicy: splitRulePolicy,
        });
        this.props.onChange(splitRulePolicy);
    };

    toggleManageSplitRulesVisible = () => {
        if (this.state.manageSplitRulesVisible) {
            this.loadSplitRulePolicy();
            this.loadSplitRules();
        }

        this.setState({
            manageSplitRulesVisible: !this.state.manageSplitRulesVisible,
        });
    };

    render() {
        const { validationResults, splitRulePolicyInfo } = this.props;
        const { splitRulePolicy } = this.state;

        return (
            <>
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
                            if (rule.isDefault)
                                return (
                                    <>
                                        <span className="bold text-primary">Default Rule</span> ({text})
                                    </>
                                );
                            return text;
                        }}
                        loading={this.props.fetching}
                        width="70%"
                        addonAfter={
                            <Button icon="edit" onClick={this.toggleManageSplitRulesVisible}>
                                Manage Rules
                            </Button>
                        }
                    />
                </Form>
                <Drawer
                    title="Commission Split Rules"
                    icon="apartment"
                    visible={this.state.manageSplitRulesVisible}
                    onClose={this.toggleManageSplitRulesVisible}
                    noTopPadding={true}
                >
                    <SplitRuleList userId={this.props.splitRulePolicyInfo.policyUserId} />
                    <DrawerFooter>
                        <Button onClick={this.toggleManageSplitRulesVisible}>Close</Button>
                    </DrawerFooter>
                </Drawer>
            </>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const splitRulesState = splitRulesSelector(state);

    return {
        fetching: splitRulesState.fetching,
        splitRules: splitRulesState.items,
    };
};

export default connect(mapStateToProps)(SplitRulePolicyForm);

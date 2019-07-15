import { Divider, Typography } from "antd";
import update from "immutability-helper";
import React, { Component } from "react";
import { connect, DispatchProp } from "react-redux";

import { getValidationSubSet, ValidationResult } from "@/app/validation";
import { Split, SplitRule } from "@/state/app/commission/splitRules";
import { Form, FormInput, FormSwitch } from "@/ui/controls";

import SplitList from "./split/SplitList";

const { Title } = Typography;

type Props = {
    splitRule: SplitRule;
    validationResults: ValidationResult[];
    onChange: (splitRule: SplitRule) => void;
} & DispatchProp;

type State = {
    splitRule: SplitRule;
    searchClientVisible: boolean;
};

class SplitRuleForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            splitRule: props.splitRule,
            searchClientVisible: false,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.splitRule != prevProps.splitRule) {
            this.setState({
                splitRule: this.props.splitRule,
            });
        }
    }

    handleChange = (fieldName: keyof SplitRule, value: string | Split[]) => {
        const splitRule = update(this.state.splitRule, { [fieldName]: { $set: value } });
        this.setState({
            splitRule: splitRule,
        });
        this.props.onChange(splitRule);
    };

    render() {
        const { validationResults } = this.props;
        const { splitRule } = this.state;

        return (
            <Form editUseCase="com_edit_commission_split_rules" className="mt-1">
                <FormInput
                    fieldName="name"
                    label="Name"
                    value={splitRule.name}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                />

                <FormSwitch
                    fieldName="isDefault"
                    label="Default"
                    value={splitRule.isDefault}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    extra="Setting the rule to 'Default' will cause this rule to be applied automatically to all future commission statement imports."
                />

                <b className="mt-1">Split Percentages</b>
                <Divider orientation="left" className="mt-1" />

                <SplitList
                    splits={splitRule.split}
                    validationResults={getValidationSubSet("split", validationResults)}
                    onChange={split => this.handleChange("split", split)}
                />
            </Form>
        );
    }
}

export default connect()(SplitRuleForm);

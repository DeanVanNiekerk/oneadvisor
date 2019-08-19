import update from "immutability-helper";
import React, { Component } from "react";
import { connect } from "react-redux";

import { ValidationResult } from "@/app/validation";
import { PolicyProductType, PolicyType, policyTypesSelector } from "@/state/app/client/lookups";
import { RootState } from "@/state/rootReducer";
import { Form, FormInput, FormSelect } from "@/ui/controls";

type Props = {
    policyProductType: PolicyProductType;
    validationResults: ValidationResult[];
    onChange: (policyProductType: PolicyProductType) => void;
    policyTypes: PolicyType[];
};

type State = {
    policyProductType: PolicyProductType;
};

class PolicyProductTypeForm extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            policyProductType: props.policyProductType,
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.policyProductType != prevProps.policyProductType)
            this.setState({
                policyProductType: this.props.policyProductType,
            });
    }

    handleChange = (fieldName: keyof PolicyProductType, value: string) => {
        const policyProductType = update(this.state.policyProductType, { [fieldName]: { $set: value } });
        this.setState({
            policyProductType: policyProductType,
        });
        this.props.onChange(policyProductType);
    };

    render() {
        const { validationResults } = this.props;
        const { policyProductType } = this.state;

        return (
            <Form>
                <FormInput
                    fieldName="name"
                    label="Name"
                    value={policyProductType.name}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    autoFocus={true}
                />
                <FormInput
                    fieldName="code"
                    label="Code"
                    value={policyProductType.code}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    disabled={!!policyProductType.id}
                />
                <FormSelect
                    fieldName="policyTypeId"
                    label="Policy Type"
                    value={policyProductType.policyTypeId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.policyTypes}
                    optionsValue="id"
                    optionsText="name"
                />
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const policyTypeState = policyTypesSelector(state);

    return {
        policyTypes: policyTypeState.items,
    };
};

export default connect(mapStateToProps)(PolicyProductTypeForm);

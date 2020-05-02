import { Typography } from "antd";
import update from "immutability-helper";
import React, { Component } from "react";
import { connect } from "react-redux";

import { ValidationResult } from "@/app/validation/types";
import { RootState } from "@/state";
import {
    policyProductTypeCharacteristicDescriptionsSelector,
    policyTypeCharacteristicsSelector,
    policyTypesSelector,
} from "@/state/lookups/client";
import {
    PolicyProductTypeEdit,
    PolicyTypeCharacteristicDescription,
} from "@/state/lookups/client/policyProductTypes/types";
import { PolicyTypeCharacteristic } from "@/state/lookups/client/policyTypeCharacteristics/types";
import { PolicyType } from "@/state/lookups/client/policyTypes/types";
import { Form, FormInput, FormSelect, FormTextArea } from "@/ui/controls";

type Props = {
    policyProductType: PolicyProductTypeEdit;
    validationResults: ValidationResult[];
    onChange: (policyProductType: PolicyProductTypeEdit) => void;
    policyTypes: PolicyType[];
    policyTypeCharacteristicDescriptions: PolicyTypeCharacteristicDescription[];
    policyTypeCharacteristics: PolicyTypeCharacteristic[];
};

type State = {
    policyProductType: PolicyProductTypeEdit;
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

    handleChange = (
        fieldName: keyof PolicyProductTypeEdit,
        value: string | PolicyTypeCharacteristicDescription[]
    ) => {
        const policyProductType = update(this.state.policyProductType, {
            [fieldName]: { $set: value },
        });
        this.setState({
            policyProductType: policyProductType,
        });
        this.props.onChange(policyProductType);
    };

    getPolicyTypeCharacteristicName = (policyTypeCharacteristicId: string) => {
        const characteristic = this.props.policyTypeCharacteristics.find(
            (c) => c.id === policyTypeCharacteristicId
        );

        if (!characteristic) return "";

        return characteristic.name;
    };

    handlePolicyTypeCharacteristicChange = (policyTypeCharacteristicId: string, value: string) => {
        const updated = this.props.policyTypeCharacteristicDescriptions.map((c) => {
            if (c.policyTypeCharacteristicId === policyTypeCharacteristicId) c.description = value;
            return c;
        });

        this.handleChange("policyTypeCharacteristics", updated);
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
                <FormSelect<string>
                    fieldName="policyTypeId"
                    label="Policy Type"
                    value={policyProductType.policyTypeId}
                    onChange={this.handleChange}
                    validationResults={validationResults}
                    options={this.props.policyTypes}
                    optionsValue="id"
                    optionsText="name"
                />
                <div className="mt-3 mb-1">
                    <Typography.Text strong>Policy Type Characteristics</Typography.Text>
                </div>
                {this.props.policyTypeCharacteristicDescriptions.map((charDescription, index) => {
                    return (
                        <FormTextArea
                            key={charDescription.policyTypeCharacteristicId}
                            fieldName={`policyTypeCharacteristic[${index}]`}
                            label={this.getPolicyTypeCharacteristicName(
                                charDescription.policyTypeCharacteristicId
                            )}
                            value={charDescription.description}
                            onChange={(_fieldName, value) =>
                                this.handlePolicyTypeCharacteristicChange(
                                    charDescription.policyTypeCharacteristicId,
                                    value
                                )
                            }
                        />
                    );
                })}
            </Form>
        );
    }
}

const mapStateToProps = (state: RootState) => {
    const policyTypeState = policyTypesSelector(state);

    return {
        policyTypes: policyTypeState.items,
        policyTypeCharacteristicDescriptions: policyProductTypeCharacteristicDescriptionsSelector(
            state
        ),
        policyTypeCharacteristics: policyTypeCharacteristicsSelector(state).items,
    };
};

export default connect(mapStateToProps)(PolicyProductTypeForm);

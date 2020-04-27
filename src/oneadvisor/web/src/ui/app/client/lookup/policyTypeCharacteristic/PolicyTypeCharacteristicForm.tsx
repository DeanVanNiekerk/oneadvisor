import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { RootState } from "@/state";
import {
    modifyPolicyTypeCharacteristic,
    policyTypeCharacteristicSelector,
    policyTypesSelector,
} from "@/state/lookups/client";
import { PolicyTypeCharacteristicEdit } from "@/state/lookups/client/policyTypeCharacteristics/types";
import { Form, FormInput, FormInputNumber, FormSelect } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const PolicyTypeCharacteristicForm: React.FC<Props> = ({
    policyTypeCharacteristic,
    policyTypes,
    validationResults,
    handleChange,
}) => {
    if (!policyTypeCharacteristic) return <React.Fragment />;

    const onChange = (fieldName: keyof PolicyTypeCharacteristicEdit, value: string | number) => {
        handleChange(policyTypeCharacteristic, fieldName, value);
    };

    return (
        <Form>
            <FormInput
                fieldName="name"
                label="Name"
                value={policyTypeCharacteristic.name}
                onChange={onChange}
                validationResults={validationResults}
                autoFocus={true}
            />
            <FormSelect
                fieldName="policyTypeId"
                label="Policy Type"
                value={policyTypeCharacteristic.policyTypeId || ""}
                onChange={onChange}
                validationResults={validationResults}
                options={policyTypes}
                optionsValue="id"
                optionsText="name"
            />
            <FormInputNumber
                fieldName="displayOrder"
                label="Order"
                value={policyTypeCharacteristic.displayOrder}
                onChange={(key: "displayOrder", value) =>
                    onChange(key, value === undefined ? 0 : value)
                }
                min={0}
                precision={0}
                validationResults={validationResults}
                autoFocus={true}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const policyTypeCharacteristicState = policyTypeCharacteristicSelector(state);
    return {
        policyTypes: policyTypesSelector(state).items,
        policyTypeCharacteristic: policyTypeCharacteristicState.policyTypeCharacteristic,
        validationResults: policyTypeCharacteristicState.validationResults,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        handleChange: (
            policyTypeCharacteristic: PolicyTypeCharacteristicEdit,
            fieldName: keyof PolicyTypeCharacteristicEdit,
            value: string | number
        ) => {
            const policyTypeCharacteristicModified = update(policyTypeCharacteristic, {
                [fieldName]: { $set: value },
            });
            dispatch(modifyPolicyTypeCharacteristic(policyTypeCharacteristicModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PolicyTypeCharacteristicForm);

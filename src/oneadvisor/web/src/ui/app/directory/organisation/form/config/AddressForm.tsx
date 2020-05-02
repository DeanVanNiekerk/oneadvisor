import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import {
    modifyOrganisationConfigAddress,
    organisationConfigSelector,
    organisationSelector,
} from "@/state/directory/organisations";
import { Address } from "@/state/directory/organisations/types";
import { Form, FormInput } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const AddressForm: React.FC<Props> = ({ address, handleChange, validationResults }) => {
    const onChange = (fieldName: keyof Address, value: string) => {
        handleChange(address, fieldName, value);
    };

    return (
        <Form editUseCase="dir_edit_organisations">
            <FormInput
                fieldName="line1"
                label="Line 1"
                onChange={onChange}
                value={address.line1 || ""}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="line2"
                label="Line 2"
                onChange={onChange}
                value={address.line2 || ""}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="suburb"
                label="Suburb"
                onChange={onChange}
                value={address.suburb || ""}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="postalCode"
                label="Postal Code"
                onChange={onChange}
                value={address.postalCode || ""}
                validationResults={validationResults}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const organisationState = organisationSelector(state);
    return {
        address: organisationConfigSelector(state).address,
        validationResults: getValidationSubSet(
            "Config.Address",
            organisationState.validationResults
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (address: Address, fieldName: keyof Address, value: string) => {
            const addressModified = update(address, { [fieldName]: { $set: value } });
            dispatch(modifyOrganisationConfigAddress(addressModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressForm);

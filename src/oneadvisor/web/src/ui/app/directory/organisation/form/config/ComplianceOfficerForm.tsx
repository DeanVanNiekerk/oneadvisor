import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import {
    ComplianceOfficer,
    modifyOrganisationConfigComplianceOfficer,
    organisationConfigSelector,
    organisationSelector,
} from "@/state/directory/organisations";
import { Form, FormInput } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const ComplianceOfficerForm: React.FC<Props> = ({
    complianceOfficer,
    handleChange,
    validationResults,
}) => {
    const onChange = (fieldName: keyof ComplianceOfficer, value: string) => {
        handleChange(complianceOfficer, fieldName, value);
    };

    return (
        <Form editUseCase="dir_edit_organisations">
            <FormInput
                fieldName="name"
                label="Name"
                onChange={onChange}
                value={complianceOfficer.name || ""}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="telephoneNumber"
                label="Telephone"
                onChange={onChange}
                value={complianceOfficer.telephoneNumber || ""}
                validationResults={validationResults}
            />
            <FormInput
                fieldName="postalAddress"
                label="Postal Address"
                onChange={onChange}
                value={complianceOfficer.postalAddress || ""}
                validationResults={validationResults}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const organisationState = organisationSelector(state);
    return {
        complianceOfficer: organisationConfigSelector(state).complianceOfficer,
        validationResults: getValidationSubSet(
            "Config.ComplianceOfficer",
            organisationState.validationResults
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (
            complianceOfficer: ComplianceOfficer,
            fieldName: keyof ComplianceOfficer,
            value: string
        ) => {
            const complianceOfficerModified = update(complianceOfficer, {
                [fieldName]: { $set: value },
            });
            dispatch(modifyOrganisationConfigComplianceOfficer(complianceOfficerModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComplianceOfficerForm);

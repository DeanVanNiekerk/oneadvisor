import update from "immutability-helper";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { RootState } from "@/state";
import {
    modifyOrganisation,
    OrganisationEdit,
    organisationSelector,
} from "@/state/directory/organisations";
import { Form, FormInput } from "@/ui/controls";

type Props = PropsFromState & PropsFromDispatch;

const OrganisationDetails: React.FC<Props> = ({
    organisation,
    validationResults,
    handleChange,
}) => {
    if (!organisation) return <React.Fragment />;

    const onChange = (fieldName: keyof OrganisationEdit, value: string | boolean | null) => {
        handleChange(organisation, fieldName, value);
    };

    return (
        <Form editUseCase="dir_edit_organisations">
            <FormInput fieldName="id" label="Id" value={organisation.id || ""} disabled={true} />
            <FormInput
                fieldName="name"
                label="Name"
                value={organisation.name}
                onChange={onChange}
                validationResults={validationResults}
                autoFocus={true}
            />
        </Form>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const organisationState = organisationSelector(state);
    return {
        organisation: organisationState.organisation,
        validationResults: organisationState.validationResults,
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        handleChange: (
            organisation: OrganisationEdit,
            fieldName: keyof OrganisationEdit,
            value: string | boolean | null
        ) => {
            const organisationModified = update(organisation, { [fieldName]: { $set: value } });
            dispatch(modifyOrganisation(organisationModified));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrganisationDetails);

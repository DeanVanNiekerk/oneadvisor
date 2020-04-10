import update from "immutability-helper";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { getValidationSubSet } from "@/app/validation";
import { RootState } from "@/state";
import {
    Application,
    applicationsSelector,
    fetchApplications,
} from "@/state/directory/applications";
import {
    modifyOrganisation,
    OrganisationEdit,
    organisationSelector,
} from "@/state/directory/organisations";
import { FormErrors, getFormSwitchList } from "@/ui/controls";

const FormSwitchList = getFormSwitchList<Application, string>();

type Props = PropsFromState & PropsFromDispatch;

const ApplicationsForm: React.FC<Props> = ({
    organisation,
    applications,
    handleChange,
    fetchApplications,
    validationResults,
}) => {
    useEffect(() => {
        fetchApplications();
    }, []);

    if (!organisation) return <React.Fragment />;

    return (
        <>
            <FormErrors validationResults={validationResults} />
            <FormSwitchList
                idKey="id"
                itemName={(application) => application.name}
                selectedIds={organisation.applicationIds}
                editUseCase="dir_edit_organisations"
                onChange={(applicationIds) => handleChange(organisation, applicationIds)}
                dataSource={applications}
            />
        </>
    );
};

type PropsFromState = ReturnType<typeof mapStateToProps>;
const mapStateToProps = (state: RootState) => {
    const organisationState = organisationSelector(state);
    return {
        organisation: organisationState.organisation,
        applications: applicationsSelector(state).items,
        validationResults: getValidationSubSet(
            "ApplicationIds",
            organisationState.validationResults,
            true,
            true
        ),
    };
};

type PropsFromDispatch = ReturnType<typeof mapDispatchToProps>;
const mapDispatchToProps = (dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
    return {
        handleChange: (organisation: OrganisationEdit, applicationIds: string[]) => {
            const organisationModified = update(organisation, {
                applicationIds: { $set: applicationIds },
            });
            dispatch(modifyOrganisation(organisationModified));
        },
        fetchApplications: () => {
            dispatch(fetchApplications());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsForm);

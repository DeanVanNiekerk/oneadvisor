import update from "immutability-helper";
import { ThunkAction } from "redux-thunk";

import { ApiAction, ApiOnSuccess, Result, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { organisationsApi } from "@/config/api/directory";
import { RootState } from "@/state/rootReducer";

import { organisationIsModifiedSelector, organisationSelector } from "../";
import { OrganisationEdit } from "../types";

type OrganisationReceiveAction = {
    type: "ORGANISATIONS_ORGANISATION_RECEIVE";
    payload: OrganisationEdit | null;
};
type OrganisationModifiedAction = {
    type: "ORGANISATIONS_ORGANISATION_MODIFIED";
    payload: OrganisationEdit;
};
type OrganisationVisibleAction = {
    type: "ORGANISATIONS_ORGANISATION_VISIBLE";
    payload: boolean;
};
type OrganisationFetchingAction = {
    type: "ORGANISATIONS_ORGANISATION_FETCHING";
};
type OrganisationFetchingErrorAction = {
    type: "ORGANISATIONS_ORGANISATION_FETCHING_ERROR";
};
type OrganisationUpdatedAction = {
    type: "ORGANISATIONS_ORGANISATION_EDIT_RECEIVE";
};
type OrganisationUpdatingAction = {
    type: "ORGANISATIONS_ORGANISATION_EDIT_FETCHING";
};
type OrganisationUpdatingErrorAction = {
    type: "ORGANISATIONS_ORGANISATION_EDIT_FETCHING_ERROR";
};
type OrganisationValidationErrorAction = {
    type: "ORGANISATIONS_ORGANISATION_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type OrganisationAction =
    | OrganisationModifiedAction
    | OrganisationVisibleAction
    | OrganisationReceiveAction
    | OrganisationFetchingAction
    | OrganisationFetchingErrorAction
    | OrganisationUpdatedAction
    | OrganisationUpdatingAction
    | OrganisationUpdatingErrorAction
    | OrganisationValidationErrorAction;

export const receiveOrganisation = (
    organisation: OrganisationEdit | null
): OrganisationReceiveAction => ({
    type: "ORGANISATIONS_ORGANISATION_RECEIVE",
    payload: organisation,
});

export const modifyOrganisation = (organisation: OrganisationEdit): OrganisationModifiedAction => ({
    type: "ORGANISATIONS_ORGANISATION_MODIFIED",
    payload: organisation,
});

export const modifyOrganisationConfigCompanyIds = (
    companyIds: string[]
): ThunkAction<void, RootState, {}, OrganisationModifiedAction> => {
    return (dispatch, getState) => {
        const { organisation } = organisationSelector(getState());
        if (!organisation) return;

        const organisationModified = update(organisation, {
            config: { companyIds: { $set: companyIds } },
        });

        dispatch(modifyOrganisation(organisationModified));
    };
};

export const organisationVisible = (visible: boolean): OrganisationVisibleAction => ({
    type: "ORGANISATIONS_ORGANISATION_VISIBLE",
    payload: visible,
});

export const fetchOrganisation = (organisationId: string): ApiAction => ({
    type: "API",
    endpoint: `${organisationsApi}/${organisationId}`,
    dispatchPrefix: "ORGANISATIONS_ORGANISATION",
});

export const clearOrganisation = (): OrganisationReceiveAction => receiveOrganisation(null);

export const saveOrganisation = (
    onSaved?: (organisation: OrganisationEdit) => void
): ThunkAction<void, RootState, {}, OrganisationReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { organisation } = organisationSelector(getState());
        if (!organisation) return;

        const onSuccess = (organisationEdit: OrganisationEdit) => {
            dispatch(clearOrganisation());
            if (onSaved) onSaved(organisationEdit);
        };

        if (organisation.id) {
            dispatch(
                updateOrganisation(organisation, () => {
                    onSuccess(organisation);
                })
            );
        } else {
            dispatch(
                insertOrganisation(organisation, result => {
                    onSuccess(result.tag);
                })
            );
        }
    };
};

export const confirmCancelOrganisation = (
    showConfirm: ShowConfirm,
    onCancelled: () => void
): ThunkAction<void, RootState, {}, OrganisationReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = organisationIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearOrganisation());
            onCancelled();
        };

        if (modifed)
            return showConfirm({
                onOk: () => {
                    cancel();
                },
            });

        cancel();
    };
};

export const updateOrganisation = (
    organisation: OrganisationEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${organisationsApi}/${organisation.id}`,
    method: "POST",
    payload: organisation,
    onSuccess: onSuccess,
    dispatchPrefix: "ORGANISATIONS_ORGANISATION_EDIT",
});

export const insertOrganisation = (
    organisation: OrganisationEdit,
    onSuccess: ApiOnSuccess<Result<OrganisationEdit>>
): ApiAction => ({
    type: "API",
    endpoint: `${organisationsApi}`,
    method: "POST",
    payload: organisation,
    onSuccess: onSuccess,
    dispatchPrefix: "ORGANISATIONS_ORGANISATION_EDIT",
});

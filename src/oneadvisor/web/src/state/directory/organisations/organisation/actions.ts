import { ApiAction, ApiOnAlways, ApiOnFailure, ApiOnSuccess, Result } from "@/app/types";
import { ValidationResult } from "@/app/validation/types";
import { organisationsApi } from "@/config/api/directory";
import { FileInfo } from "@/state/types";

import { OrganisationEdit } from "../types";

export type OrganisationReceiveAction = {
    type: "ORGANISATIONS_ORGANISATION_RECEIVE";
    payload: OrganisationEdit | null;
};
export type OrganisationModifiedAction = {
    type: "ORGANISATIONS_ORGANISATION_MODIFIED";
    payload: OrganisationEdit;
};
export type OrganisationVisibleAction = {
    type: "ORGANISATIONS_ORGANISATION_VISIBLE";
    payload: boolean;
};
export type OrganisationFetchingAction = {
    type: "ORGANISATIONS_ORGANISATION_FETCHING";
};
export type OrganisationFetchingErrorAction = {
    type: "ORGANISATIONS_ORGANISATION_FETCHING_ERROR";
};
export type OrganisationUpdatedAction = {
    type: "ORGANISATIONS_ORGANISATION_EDIT_RECEIVE";
};
export type OrganisationUpdatingAction = {
    type: "ORGANISATIONS_ORGANISATION_EDIT_FETCHING";
};
export type OrganisationUpdatingErrorAction = {
    type: "ORGANISATIONS_ORGANISATION_EDIT_FETCHING_ERROR";
};
export type OrganisationValidationErrorAction = {
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

export const organisationVisible = (visible: boolean): OrganisationVisibleAction => ({
    type: "ORGANISATIONS_ORGANISATION_VISIBLE",
    payload: visible,
});

export const fetchOrganisation = (organisationId: string): ApiAction => ({
    type: "API",
    endpoint: `${organisationsApi}/${organisationId}`,
    dispatchPrefix: "ORGANISATIONS_ORGANISATION",
});

export const getOrganisationLogoFileInfo = (
    organisationId: string,
    onSuccess: ApiOnSuccess<FileInfo>,
    onFailure?: ApiOnFailure,
    onAlways?: ApiOnAlways
): ApiAction => ({
    type: "API",
    endpoint: `${organisationsApi}/${organisationId}/config/logo`,
    onSuccess: onSuccess,
    onFailure: onFailure,
    onAlways: onAlways,
});

export const updateOrganisation = (
    organisation: OrganisationEdit,
    onSuccess?: ApiOnSuccess
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
    onSuccess?: ApiOnSuccess<Result<OrganisationEdit>>
): ApiAction => ({
    type: "API",
    endpoint: `${organisationsApi}`,
    method: "POST",
    payload: organisation,
    onSuccess: onSuccess,
    dispatchPrefix: "ORGANISATIONS_ORGANISATION_EDIT",
});

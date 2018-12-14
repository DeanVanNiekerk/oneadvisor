import { ApiAction, ApiOnSuccess, ValidationResult } from '@/app/types';
import { organisationsApi } from '@/config/api/directory';

import { Organisation } from '../types';

type OrganisationReceiveAction = {
    type: 'ORGANISATIONS_ORGANISATION_RECEIVE';
    payload: Organisation;
};
type OrganisationFetchingAction = {
    type: 'ORGANISATIONS_ORGANISATION_FETCHING';
};
type OrganisationFetchingErrorAction = {
    type: 'ORGANISATIONS_ORGANISATION_FETCHING_ERROR';
};

type OrganisationUpdatedAction = {
    type: 'ORGANISATIONS_ORGANISATION_EDIT_RECEIVE';
};
type OrganisationUpdatingAction = {
    type: 'ORGANISATIONS_ORGANISATION_EDIT_FETCHING';
};
type OrganisationUpdatingErrorAction = {
    type: 'ORGANISATIONS_ORGANISATION_EDIT_FETCHING_ERROR';
};
type OrganisationValidationErrorAction = {
    type: 'ORGANISATIONS_ORGANISATION_EDIT_VALIDATION_ERROR';
    payload: ValidationResult[];
};

export type OrganisationAction =
    | OrganisationReceiveAction
    | OrganisationFetchingAction
    | OrganisationFetchingErrorAction
    | OrganisationUpdatedAction
    | OrganisationUpdatingAction
    | OrganisationUpdatingErrorAction
    | OrganisationValidationErrorAction;

export const receiveOrganisation = (
    organisation: Organisation
): OrganisationReceiveAction => ({
    type: 'ORGANISATIONS_ORGANISATION_RECEIVE',
    payload: organisation
});

export const fetchOrganisation = (organisationId: string): ApiAction => ({
    type: 'API',
    endpoint: `${organisationsApi}/${organisationId}`,
    dispatchPrefix: 'ORGANISATIONS_ORGANISATION'
});

export const updateOrganisation = (
    organisation: Organisation,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${organisationsApi}/${organisation.id}`,
    method: 'POST',
    payload: organisation,
    onSuccess: onSuccess,
    dispatchPrefix: 'ORGANISATIONS_ORGANISATION_EDIT'
});

export const insertOrganisation = (
    organisation: Organisation,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${organisationsApi}`,
    method: 'POST',
    payload: organisation,
    onSuccess: onSuccess,
    dispatchPrefix: 'ORGANISATIONS_ORGANISATION_EDIT'
});

// @flow

import type { ApiAction, ApiOnSuccess, ValidationResult } from '@/state/types';
import { organisationsApi } from '@/config/api/directory';
import type { Organisation } from '../types';

type OrganisationReceiveAction = {
    type: 'ORGANISATIONS_ORGANISATION_RECEIVE',
    payload: Organisation
};
type OrganisationFetchingAction = {
    type: 'ORGANISATIONS_ORGANISATION_FETCHING'
};
type OrganisationFetchingErrorAction = {
    type: 'ORGANISATIONS_ORGANISATION_FETCHING_ERROR'
};

type OrganisationUpdatedAction = {
    type: 'ORGANISATIONS_ORGANISATION_EDIT_RECEIVE'
};
type OrganisationUpdatingAction = {
    type: 'ORGANISATIONS_ORGANISATION_EDIT_FETCHING'
};
type OrganisationUpdatingErrorAction = {
    type: 'ORGANISATIONS_ORGANISATION_EDIT_FETCHING_ERROR'
};
type OrganisationValidationErrorAction = {
    type: 'ORGANISATIONS_ORGANISATION_EDIT_VALIDATION_ERROR',
    payload: ValidationResult[]
};

export type Action =
    | OrganisationReceiveAction
    | OrganisationFetchingAction
    | OrganisationFetchingErrorAction
    | OrganisationUpdatedAction
    | OrganisationUpdatingAction
    | OrganisationUpdatingErrorAction
    | OrganisationValidationErrorAction;

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

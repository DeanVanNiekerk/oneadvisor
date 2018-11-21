// @flow

import type { ApiAction } from '@/state/types';
import { organisationsApi } from '@/config/api/directory';
import type { Organisation } from '../types';

type OrganisationListReceiveAction = {
    type: 'ORGANISATIONS_LIST_RECEIVE',
    payload: Organisation[]
};
type OrganisationListFetchingAction = { type: 'ORGANISATIONS_LIST_FETCHING' };
type OrganisationListFetchingErrorAction = {
    type: 'ORGANISATIONS_LIST_FETCHING_ERROR'
};

export type Action =
    | OrganisationListReceiveAction
    | OrganisationListFetchingAction
    | OrganisationListFetchingErrorAction;

export const fetchOrganisations = (): ApiAction => ({
    type: 'API',
    endpoint: organisationsApi,
    dispatchPrefix: 'ORGANISATIONS_LIST'
});

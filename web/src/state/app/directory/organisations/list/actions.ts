import { organisationsApi } from '@/config/api/directory';
import { ApiAction, PagedItems } from '@/state/types';

import { Organisation } from '../types';



type OrganisationListReceiveAction = {
    type: 'ORGANISATIONS_LIST_RECEIVE',
    payload: PagedItems<Organisation>
};
type OrganisationListFetchingAction = { type: 'ORGANISATIONS_LIST_FETCHING' };
type OrganisationListFetchingErrorAction = {
    type: 'ORGANISATIONS_LIST_FETCHING_ERROR'
};
type OrganisationListPageNumberReceiveAction = {
    type: 'ORGANISATIONS_LIST_PAGE_NUMBER_RECEIVE',
    payload: number
};

export type Action =
    | OrganisationListReceiveAction
    | OrganisationListFetchingAction
    | OrganisationListFetchingErrorAction
    | OrganisationListPageNumberReceiveAction;

export const fetchOrganisations = (): ApiAction => {
    let api = organisationsApi;
    //api = appendPageOptionQuery(api, pageOptions);
    return {
        type: 'API',
        endpoint: api,
        dispatchPrefix: 'ORGANISATIONS_LIST'
    };
};

export const receivePageNumber = (
    pageNumber: number
): OrganisationListPageNumberReceiveAction => ({
    type: 'ORGANISATIONS_LIST_PAGE_NUMBER_RECEIVE',
    payload: pageNumber
});

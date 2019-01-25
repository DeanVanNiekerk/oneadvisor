import { appendFiltersQuery } from '@/app/query';
import { Filters, PagedItems } from '@/app/table';
import { ApiAction } from '@/app/types';
import { contactsApi } from '@/config/api/member';

import { Contact } from '../types';

type ContactListReceiveAction = {
    type: 'CONTACTS_LIST_RECEIVE';
    payload: PagedItems<Contact>;
};
type ContactListFetchingAction = { type: 'CONTACTS_LIST_FETCHING' };
type ContactListFetchingErrorAction = {
    type: 'CONTACTS_LIST_FETCHING_ERROR';
};

export type ContactListAction =
    | ContactListReceiveAction
    | ContactListFetchingAction
    | ContactListFetchingErrorAction;

export const fetchContacts = (filters: Filters): ApiAction => {
    let api = contactsApi;
    api = appendFiltersQuery(api, filters);
    return {
        type: 'API',
        endpoint: api,
        dispatchPrefix: 'CONTACTS_LIST'
    };
};

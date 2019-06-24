import { Dispatch } from 'redux';

import { ApiAction } from '@/app/types';
import { allDirectoryLookupsApi } from '@/config/api/directory';

import { Lookups, receiveCompanies } from '../';

type LookupsReceiveAction = {
    type: "DIRECTORY_LOOKUPS_RECEIVE";
};
type LookupsFetchingAction = { type: "DIRECTORY_LOOKUPS_FETCHING" };
type LookupsFetchingErrorAction = { type: "DIRECTORY_LOOKUPS_FETCHING_ERROR" };

export type LookupsAction =
    | LookupsReceiveAction
    | LookupsFetchingAction
    | LookupsFetchingErrorAction;

export const fetchAllDirectoryLookups = (): ApiAction => ({
    type: "API",
    endpoint: allDirectoryLookupsApi,
    onSuccess: (payload: Lookups, dispatch: Dispatch) => {
        dispatch(receiveCompanies(payload.companies));
    },
    dispatchPrefix: "DIRECTORY_LOOKUPS",
});

import { Dispatch } from 'redux';

import { ApiAction } from '@/app/types';
import { allLookupsApi } from '@/config/api/directory';

import { Lookups, receiveClientTypes, receiveContactTypes, receiveMarritalStatus, receivePolicyTypes } from '../';

type LookupsReceiveAction = {
    type: "CLIENT_LOOKUPS_RECEIVE";
};
type LookupsFetchingAction = { type: "CLIENT_LOOKUPS_FETCHING" };
type LookupsFetchingErrorAction = { type: "CLIENT_LOOKUPS_FETCHING_ERROR" };

export type LookupsAction =
    | LookupsReceiveAction
    | LookupsFetchingAction
    | LookupsFetchingErrorAction;

export const fetchAllClientLookups = (): ApiAction => ({
    type: "API",
    endpoint: allLookupsApi,
    onSuccess: (payload: Lookups, dispatch: Dispatch) => {
        dispatch(receiveMarritalStatus(payload.marritalStatus));
        dispatch(receiveContactTypes(payload.contactTypes));
        dispatch(receivePolicyTypes(payload.policyTypes));
        dispatch(receiveClientTypes(payload.clientTypes));
    },
    dispatchPrefix: "CLIENT_LOOKUPS",
});

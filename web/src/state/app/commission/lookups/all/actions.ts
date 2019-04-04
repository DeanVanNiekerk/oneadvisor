import { Dispatch } from 'redux';

import { ApiAction } from '@/app/types';
import { allLookupsApi } from '@/config/api/directory';

import {
    Lookups, receiveCommissionEarningsTypes, receiveCommissionStatementTemplateFieldNames, receiveCommissionTypes
} from '../';

type LookupsReceiveAction = {
    type: "COMMISSION_LOOKUPS_RECEIVE";
};
type LookupsFetchingAction = { type: "COMMISSION_LOOKUPS_FETCHING" };
type LookupsFetchingErrorAction = { type: "COMMISSION_LOOKUPS_FETCHING_ERROR" };

export type LookupsAction =
    | LookupsReceiveAction
    | LookupsFetchingAction
    | LookupsFetchingErrorAction;

export const fetchAllCommissionLookups = (): ApiAction => ({
    type: "API",
    endpoint: allLookupsApi,
    onSuccess: (payload: Lookups, dispatch: Dispatch) => {
        dispatch(receiveCommissionTypes(payload.commissionTypes));
        dispatch(
            receiveCommissionEarningsTypes(payload.commissionEarningsTypes)
        );
        dispatch(
            receiveCommissionStatementTemplateFieldNames(
                payload.commissionStatementTemplateFieldNames
            )
        );
    },
    dispatchPrefix: "COMMISSION_LOOKUPS",
});

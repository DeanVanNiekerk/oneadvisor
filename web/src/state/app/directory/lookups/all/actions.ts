import { Dispatch } from 'redux';

import { ApiAction } from '@/app/types';
import { allLookupsApi } from '@/config/api/directory';

import { receiveCommissionStatementTemplateFieldNames } from '../commissionStatementTemplateFieldNames';
import { receiveCommissionTypes } from '../commissionTypes';
import { receiveCompanies } from '../companies';
import { receiveContactTypes } from '../contactTypes';
import { receiveMarritalStatus } from '../marritalStatus';
import { receivePolicyTypes } from '../policyTypes';
import { Lookups } from './types';

type LookupsReceiveAction = {
    type: 'LOOKUPS_RECEIVE';
};
type LookupsFetchingAction = { type: 'LOOKUPS_FETCHING' };
type LookupsFetchingErrorAction = { type: 'LOOKUPS_FETCHING_ERROR' };

export type LookupsAction =
    | LookupsReceiveAction
    | LookupsFetchingAction
    | LookupsFetchingErrorAction;

export const fetchAllLookups = (): ApiAction => ({
    type: 'API',
    endpoint: allLookupsApi,
    onSuccess: (payload: Lookups, dispatch: Dispatch) => {
        dispatch(receiveCompanies(payload.companies));
        dispatch(receiveCommissionTypes(payload.commissionTypes));
        dispatch(receiveMarritalStatus(payload.marritalStatus));
        dispatch(receiveContactTypes(payload.contactTypes));
        dispatch(receivePolicyTypes(payload.policyTypes));
        dispatch(
            receiveCommissionStatementTemplateFieldNames(
                payload.commissionStatementTemplateFieldNames
            )
        );
    },
    dispatchPrefix: 'LOOKUPS'
});

import { PagedItems } from '@/app/table';
import { ApiAction } from '@/app/types';
import { commissionTypesApi } from '@/config/api/directory';

import { CommissionType } from '../types';

type CommissionTypeListReceiveAction = {
    type: 'COMMISSIONTYPES_LIST_RECEIVE';
    payload: CommissionType[];
};
type CommissionTypeListFetchingAction = {
    type: 'COMMISSIONTYPES_LIST_FETCHING';
};
type CommissionTypeListFetchingErrorAction = {
    type: 'COMMISSIONTYPES_LIST_FETCHING_ERROR';
};

export type CommissionTypeListAction =
    | CommissionTypeListReceiveAction
    | CommissionTypeListFetchingAction
    | CommissionTypeListFetchingErrorAction;

export const receiveCommissionTypes = (
    payload: CommissionType[]
): CommissionTypeListAction => ({
    type: 'COMMISSIONTYPES_LIST_RECEIVE',
    payload
});

export const fetchCommissionTypes = (): ApiAction => {
    return {
        type: 'API',
        endpoint: commissionTypesApi,
        dispatchPrefix: 'COMMISSIONTYPES_LIST'
    };
};

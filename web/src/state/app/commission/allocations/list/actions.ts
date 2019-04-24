import { appendFiltersQuery } from '@/app/query';
import { Filters, PagedItems } from '@/app/table';
import { ApiAction } from '@/app/types';
import { allocationsApi } from '@/config/api/commission';

import { Allocation } from '../types';

type AllocationListReceiveAction = {
    type: "ALLOCATIONS_LIST_RECEIVE";
    payload: PagedItems<Allocation>;
};
type AllocationListFetchingAction = { type: "ALLOCATIONS_LIST_FETCHING" };
type AllocationListFetchingErrorAction = {
    type: "ALLOCATIONS_LIST_FETCHING_ERROR";
};

export type AllocationListAction =
    | AllocationListReceiveAction
    | AllocationListFetchingAction
    | AllocationListFetchingErrorAction;

export const fetchAllocations = (filters: Filters): ApiAction => {
    let api = allocationsApi;
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "ALLOCATIONS_LIST",
    };
};

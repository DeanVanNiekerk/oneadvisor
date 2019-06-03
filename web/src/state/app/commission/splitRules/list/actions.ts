import { appendFiltersQuery } from '@/app/query';
import { Filters, PagedItems } from '@/app/table';
import { ApiAction } from '@/app/types';
import { splitRulesApi } from '@/config/api/commission';

import { SplitRule } from '../types';

type SplitRuleListReceiveAction = {
    type: "SPLITRULES_LIST_RECEIVE";
    payload: PagedItems<SplitRule>;
};
type SplitRuleListFetchingAction = { type: "SPLITRULES_LIST_FETCHING" };
type SplitRuleListFetchingErrorAction = {
    type: "SPLITRULES_LIST_FETCHING_ERROR";
};

export type SplitRuleListAction =
    | SplitRuleListReceiveAction
    | SplitRuleListFetchingAction
    | SplitRuleListFetchingErrorAction;

export const fetchSplitRules = (filters: Filters): ApiAction => {
    let api = splitRulesApi;
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "SPLITRULES_LIST",
    };
};

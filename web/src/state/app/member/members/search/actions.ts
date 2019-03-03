import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from '@/app/query';
import { Filters, PagedItems } from '@/app/table';
import { ApiAction } from '@/app/types';
import { membersApi } from '@/config/api/member';

import { Member } from '../types';

type MemberSearchReceiveAction = {
    type: "MEMBERS_SEARCH_RECEIVE";
    payload: PagedItems<Member>;
};
type MemberSearchFetchingAction = { type: "MEMBERS_SEARCH_FETCHING" };
type MemberSearchFetchingErrorAction = {
    type: "MEMBERS_SEARCH_FETCHING_ERROR";
};

export type MemberSearchAction =
    | MemberSearchReceiveAction
    | MemberSearchFetchingAction
    | MemberSearchFetchingErrorAction;

export const searchMembers = (filters: Filters): ApiAction => {
    let api = membersApi;
    api = appendSortOptionQuery(api, {
        column: "lastName",
        direction: "asc",
    });
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "MEMBERS_SEARCH",
    };
};

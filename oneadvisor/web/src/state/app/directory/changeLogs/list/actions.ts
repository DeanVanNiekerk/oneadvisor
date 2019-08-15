import { appendPageOptionQuery, appendSortOptionQuery } from "@/app/query";
import { PagedItems, PageOptions, SortOptions } from "@/app/table";
import { ApiAction } from "@/app/types";
import { changeLogsApi } from "@/config/api/directory";

import { ChangeLog } from "../types";

type ChangeLogListReceiveAction = {
    type: 'CHANGELOGS_LIST_RECEIVE';
    payload: PagedItems<ChangeLog>;
};
type ChangeLogListFetchingAction = { type: 'CHANGELOGS_LIST_FETCHING' };
type ChangeLogListFetchingErrorAction = {
    type: 'CHANGELOGS_LIST_FETCHING_ERROR';
};
type ChangeLogPageOptionsReceiveAction = {
    type: "CHANGELOGS_LIST_PAGE_OPTIONS_RECEIVE";
    payload: PageOptions;
};
type ChangeLogSortOptionsReceiveAction = {
    type: "CHANGELOGS_LIST_SORT_OPTIONS_RECEIVE";
    payload: SortOptions;
};

export type ChangeLogListAction =
    | ChangeLogListReceiveAction
    | ChangeLogListFetchingAction
    | ChangeLogListFetchingErrorAction
    | ChangeLogPageOptionsReceiveAction
    | ChangeLogSortOptionsReceiveAction;

export const fetchChangeLogs = (pageOptions: PageOptions,
    sortOptions: SortOptions, ): ApiAction => {
    let api = changeLogsApi;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendSortOptionQuery(api, sortOptions);
    return {
        type: 'API',
        endpoint: api,
        dispatchPrefix: 'CHANGELOGS_LIST'
    };
};

export const receivePageOptions = (
    pageOptions: PageOptions
): ChangeLogPageOptionsReceiveAction => ({
    type: "CHANGELOGS_LIST_PAGE_OPTIONS_RECEIVE",
    payload: pageOptions,
});

export const receiveSortOptions = (
    sortOptions: SortOptions
): ChangeLogSortOptionsReceiveAction => ({
    type: "CHANGELOGS_LIST_SORT_OPTIONS_RECEIVE",
    payload: sortOptions,
});

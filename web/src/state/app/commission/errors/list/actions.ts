import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from '@/app/query';
import { Filters, PagedItems, PageOptions, SortOptions } from '@/app/table';
import { ApiAction } from '@/app/types';
import { statementsApi } from '@/config/api/commission';

import { CommissionError } from '../types';

type ErrorListReceiveAction = {
    type: "COMMISSIONS_ERRORS_LIST_RECEIVE";
    payload: PagedItems<CommissionError>;
};
type ErrorListFetchingAction = { type: "COMMISSIONS_ERRORS_LIST_FETCHING" };
type ErrorListFetchingErrorAction = {
    type: "COMMISSIONS_ERRORS_LIST_FETCHING_ERROR";
};
type ErrorListPageOptionsReceiveAction = {
    type: "COMMISSIONS_ERRORS_LIST_PAGE_OPTIONS_RECEIVE";
    payload: PageOptions;
};
type ErrorListSortOptionsReceiveAction = {
    type: "COMMISSIONS_ERRORS_LIST_SORT_OPTIONS_RECEIVE";
    payload: SortOptions;
};

export type ErrorListAction =
    | ErrorListReceiveAction
    | ErrorListFetchingAction
    | ErrorListFetchingErrorAction
    | ErrorListPageOptionsReceiveAction
    | ErrorListSortOptionsReceiveAction;

export const fetchErrors = (
    statementId: string,
    pageOptions: PageOptions,
    sortOptions: SortOptions
): ApiAction => {
    let api = `${statementsApi}/${statementId}/errors`;
    api = appendPageOptionQuery(api, pageOptions);
    api = appendSortOptionQuery(api, sortOptions);
    return {
        type: "API",
        endpoint: api,
        dispatchPrefix: "COMMISSIONS_ERRORS_LIST",
    };
};

export const receivePageOptions = (
    pageOptions: PageOptions
): ErrorListPageOptionsReceiveAction => ({
    type: "COMMISSIONS_ERRORS_LIST_PAGE_OPTIONS_RECEIVE",
    payload: pageOptions,
});

export const receiveSortOptions = (
    sortOptions: SortOptions
): ErrorListSortOptionsReceiveAction => ({
    type: "COMMISSIONS_ERRORS_LIST_SORT_OPTIONS_RECEIVE",
    payload: sortOptions,
});

export const getCommissionErrors = (
    statementId: string,
    hasValidFormat: boolean,
    onSuccess: (errors: PagedItems<CommissionError>) => void
): ApiAction => ({
    type: "API",
    endpoint: `${statementsApi}/${statementId}/errors?hasValidFormat=${hasValidFormat}`,
    onSuccess: onSuccess,
});

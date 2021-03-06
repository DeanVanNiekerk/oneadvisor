import { ThunkAction } from "redux-thunk";

import { downloadExcel } from "@/app/excel/helpers";
import { appendFiltersQuery, appendPageOptionQuery, appendSortOptionQuery } from "@/app/query";
import { Filters, PagedItems, PageOptions, SortOptions } from "@/app/table";
import { ApiAction } from "@/app/types";
import { statementsApi } from "@/config/api/commission";
import { RootState } from "@/state";

import { commissionErrorsSelector } from "../";
import { CommissionError, CommissionErrorsFilters } from "../types";

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

export const fetchCommissionErrors = (
    statementId?: string
): ThunkAction<void, RootState, {}, ApiAction> => {
    return (dispatch, getState) => {
        const { pageOptions, sortOptions } = commissionErrorsSelector(getState());

        const filters: Filters = {};

        if (statementId) filters.commissionStatementId = [statementId];

        let api = `${statementsApi}/errors`;
        api = appendPageOptionQuery(api, pageOptions);
        api = appendSortOptionQuery(api, sortOptions);
        api = appendFiltersQuery(api, filters);

        dispatch({
            type: "API",
            endpoint: api,
            dispatchPrefix: "COMMISSIONS_ERRORS_LIST",
        });
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
    filters: CommissionErrorsFilters,
    onSuccess: (errors: PagedItems<CommissionError>) => void
): ApiAction => {
    let api = `${statementsApi}/errors`;
    api = appendFiltersQuery(api, filters);
    return {
        type: "API",
        endpoint: api,
        onSuccess: onSuccess,
    };
};

export const downloadCommissionErrors = (
    errors: PagedItems<CommissionError>,
    companyName: string,
    date: string
) => {
    let fileName = "MappingErrors";

    if (companyName) fileName += `_${companyName}`;

    fileName += `_${date}.xlsx`;

    downloadExcel(
        errors.items.map((e) => {
            return {
                ...e.data,
                policyTypeCode: e.policyTypeCode,
                clientTypeCode: "",
                companyId: e.companyId,
                companyName: e.companyName,
            };
        }),
        fileName
    );
};

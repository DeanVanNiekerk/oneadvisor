import { Filters, PageOptions, SortOptions } from "@/app/table";
import { defaultPageOptions, defaultSortOptions } from "@/app/table/defaults";

import { Client } from "../types";
import { ClientListAction } from "./actions";

export type State = {
    readonly items: Client[];
    readonly totalItems: number;
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filters: Filters | null;
    readonly selectedClientIds: string[];
};

export const defaultState: State = {
    items: [],
    totalItems: 0,
    fetching: false,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions("", "desc"),
    filters: null,
    selectedClientIds: [],
};

export const reducer = (state: State = defaultState, action: ClientListAction): State => {
    switch (action.type) {
        case "CLIENTS_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "CLIENTS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "CLIENTS_LIST_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        case "CLIENTS_LIST_PAGE_OPTIONS_RECEIVE": {
            return {
                ...state,
                pageOptions: {
                    ...action.payload,
                },
            };
        }
        case "CLIENTS_LIST_SORT_OPTIONS_RECEIVE": {
            return {
                ...state,
                sortOptions: {
                    ...action.payload,
                },
            };
        }
        case "CLIENTS_LIST_FILTERS_RECEIVE": {
            return {
                ...state,
                filters: {
                    ...action.payload,
                },
            };
        }
        case "CLIENTS_LIST_SELECTED_RECEIVE": {
            return {
                ...state,
                selectedClientIds: action.payload,
            };
        }
        default:
            return state;
    }
};

import { defaultPageOptions, defaultSortOptions } from "@/app/table";

import { ListState } from "../types";
import { ChangeLogListAction } from "./actions";

export const defaultState: ListState = {
    totalItems: 0,
    items: [],
    fetching: false,
    pageOptions: defaultPageOptions(),
    sortOptions: defaultSortOptions("releaseDate", "desc"),
};

export const reducer = (
    state: ListState = defaultState,
    action: ChangeLogListAction
): ListState => {
    switch (action.type) {
        case "CHANGELOGS_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "CHANGELOGS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "CHANGELOGS_LIST_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        case "CHANGELOGS_LIST_PAGE_OPTIONS_RECEIVE": {
            return {
                ...state,
                pageOptions: {
                    ...action.payload,
                },
            };
        }
        case "CHANGELOGS_LIST_SORT_OPTIONS_RECEIVE": {
            return {
                ...state,
                sortOptions: {
                    ...action.payload,
                },
            };
        }
        default:
            return state;
    }
};

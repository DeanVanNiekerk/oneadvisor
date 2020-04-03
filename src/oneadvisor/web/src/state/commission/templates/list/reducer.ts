import { ListState } from "../types";
import { TemplateListAction } from "./actions";

export const defaultState: ListState = {
    items: [],
    totalItems: 0,
    fetching: false,
};

export const reducer = (state: ListState = defaultState, action: TemplateListAction): ListState => {
    switch (action.type) {
        case "COMMISSIONS_STATEMENT_TEMPLATES_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "COMMISSIONS_STATEMENT_TEMPLATES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "COMMISSIONS_STATEMENT_TEMPLATES_LIST_FETCHING_ERROR": {
            return {
                ...state,
                items: [],
                fetching: false,
            };
        }
        default:
            return state;
    }
};

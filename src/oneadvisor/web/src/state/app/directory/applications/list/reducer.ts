import { Application } from "../types";
import { ApplicationListAction } from "./actions";

export type State = {
    readonly items: Application[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
};

export const reducer = (state: State = defaultState, action: ApplicationListAction): State => {
    switch (action.type) {
        case "APPLICATIONS_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "APPLICATIONS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "APPLICATIONS_LIST_FETCHING_ERROR": {
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

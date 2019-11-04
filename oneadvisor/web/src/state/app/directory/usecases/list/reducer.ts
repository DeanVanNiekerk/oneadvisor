import { UseCase } from "../types";
import { UseCaseListAction } from "./actions";

export type State = {
    readonly items: UseCase[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
};

export const reducer = (state: State = defaultState, action: UseCaseListAction): State => {
    switch (action.type) {
        case "USECASES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "USECASES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "USECASES_LIST_FETCHING_ERROR": {
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

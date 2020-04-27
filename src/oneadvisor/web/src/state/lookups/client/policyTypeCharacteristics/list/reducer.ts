import { PolicyTypeCharacteristicListState } from "../types";
import { PolicyTypeCharacteristicListAction } from "./actions";

export const defaultState: PolicyTypeCharacteristicListState = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: PolicyTypeCharacteristicListState = defaultState,
    action: PolicyTypeCharacteristicListAction
): PolicyTypeCharacteristicListState => {
    switch (action.type) {
        case "POLICYTYPECHARACTERISTICS_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "POLICYTYPECHARACTERISTICS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "POLICYTYPECHARACTERISTICS_LIST_FETCHING_ERROR": {
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

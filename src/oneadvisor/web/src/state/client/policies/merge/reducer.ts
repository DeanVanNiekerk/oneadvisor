import { MergeState } from "../types";
import { PolicyMergeAction } from "./actions";

export const defaultState: MergeState = {
    visible: false,
    fetching: false, //merging
};

export const reducer = (
    state: MergeState = defaultState,
    action: PolicyMergeAction
): MergeState => {
    switch (action.type) {
        case "POLICIES_MERGE_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        case "POLICIES_MERGE_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "POLICIES_MERGE_RECEIVE":
        case "POLICIES_MERGE_FETCHING_ERROR":
        case "POLICIES_MERGE_VALIDATION_ERROR": {
            return {
                ...state,
                fetching: false,
            };
        }
        default:
            return state;
    }
};

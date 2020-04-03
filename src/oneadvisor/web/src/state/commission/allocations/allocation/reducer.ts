import { AllocationState } from "../types";
import { AllocationAction } from "./actions";

export const defaultState: AllocationState = {
    allocation: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (
    state: AllocationState = defaultState,
    action: AllocationAction
): AllocationState => {
    switch (action.type) {
        case "ALLOCATIONS_ALLOCATION_RECEIVE": {
            return {
                ...state,
                allocation: action.payload,
                validationResults: [],
                fetching: false,
            };
        }
        case "ALLOCATIONS_ALLOCATION_FETCHING": {
            return {
                ...state,
                validationResults: [],
                fetching: true,
            };
        }
        case "ALLOCATIONS_ALLOCATION_FETCHING_ERROR": {
            return {
                ...state,
                allocation: null,
                fetching: false,
            };
        }
        case "ALLOCATIONS_ALLOCATION_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "ALLOCATIONS_ALLOCATION_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "ALLOCATIONS_ALLOCATION_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "ALLOCATIONS_ALLOCATION_EDIT_VALIDATION_ERROR": {
            return {
                ...state,
                updating: false,
                validationResults: action.payload,
            };
        }
        default:
            return state;
    }
};

import { ValidationResult } from "@/app/validation";

import { AllocationEdit } from "../types";
import { AllocationAction } from "./actions";

export type State = {
    readonly allocation: AllocationEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export const defaultState: State = {
    allocation: null,
    fetching: false,
    updating: false,
    validationResults: [],
};

export const reducer = (state: State = defaultState, action: AllocationAction): State => {
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

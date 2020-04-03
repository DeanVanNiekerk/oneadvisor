import { BranchState } from "../types";
import { BranchAction } from "./actions";

export const defaultState: BranchState = {
    branch: null,
    branchOriginal: null,
    fetching: false,
    updating: false,
    validationResults: [],
    visible: false,
};

export const reducer = (state: BranchState = defaultState, action: BranchAction): BranchState => {
    switch (action.type) {
        case "BRANCHES_BRANCH_RECEIVE": {
            return {
                ...state,
                branch: action.payload,
                branchOriginal: action.payload,
                validationResults: [],
                fetching: false,
            };
        }
        case "BRANCHES_BRANCH_MODIFIED": {
            return {
                ...state,
                branch: action.payload,
            };
        }
        case "BRANCHES_BRANCH_FETCHING": {
            return {
                ...state,
                branch: null,
                branchOriginal: null,
                validationResults: [],
                fetching: true,
            };
        }
        case "BRANCHES_BRANCH_FETCHING_ERROR": {
            return {
                ...state,
                fetching: false,
            };
        }
        case "BRANCHES_BRANCH_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "BRANCHES_BRANCH_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "BRANCHES_BRANCH_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "BRANCHES_BRANCH_EDIT_VALIDATION_ERROR": {
            return {
                ...state,
                updating: false,
                validationResults: action.payload,
            };
        }
        case "BRANCHES_BRANCH_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        default:
            return state;
    }
};

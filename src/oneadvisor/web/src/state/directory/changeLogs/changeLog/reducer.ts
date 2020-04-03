import { ChangeLogState } from "../types";
import { ChangeLogAction } from "./actions";

export const defaultState: ChangeLogState = {
    changeLog: null,
    updating: false,
    validationResults: [],
};

export const reducer = (
    state: ChangeLogState = defaultState,
    action: ChangeLogAction
): ChangeLogState => {
    switch (action.type) {
        case "CHANGELOGS_CHANGELOG_RECEIVE": {
            return {
                ...state,
                changeLog: action.payload,
                validationResults: [],
            };
        }
        case "CHANGELOGS_CHANGELOG_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "CHANGELOGS_CHANGELOG_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "CHANGELOGS_CHANGELOG_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "CHANGELOGS_CHANGELOG_EDIT_VALIDATION_ERROR": {
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

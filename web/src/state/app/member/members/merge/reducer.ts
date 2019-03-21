import { Member } from '../types';
import { MemberMergeAction } from './actions';

export type State = {
    readonly members: Member[];
    readonly fetching: boolean;
    readonly currentStepIndex: number;
    readonly steps: string[];
    readonly insertedMember: Member | null;
};

export const defaultState: State = {
    members: [],
    fetching: false,
    currentStepIndex: 0,
    steps: ["Members", "Review", "Result"],
    insertedMember: null,
};

export const reducer = (
    state: State = defaultState,
    action: MemberMergeAction
): State => {
    switch (action.type) {
        case "MEMBERS_MERGE_RECEIVE": {
            return {
                ...state,
                members: action.payload.items,
                fetching: false,
            };
        }
        case "MEMBERS_MERGE_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "MEMBERS_MERGE_FETCHING_ERROR": {
            return {
                ...state,
                members: [],
                fetching: false,
            };
        }
        case "MEMBERS_MERGE_NEXT_STEP": {
            return {
                ...state,
                currentStepIndex: state.currentStepIndex + 1,
            };
        }
        case "MEMBERS_MERGE_PREVIOUS_STEP": {
            return {
                ...state,
                currentStepIndex: state.currentStepIndex - 1,
            };
        }
        case "MEMBERS_MERGE_RESET": {
            return {
                ...state,
                members: [],
                currentStepIndex: 0,
                insertedMember: null,
            };
        }
        case "MEMBERS_MERGE_INSERTED_RECEIVE": {
            return {
                ...state,
                insertedMember: action.payload,
            };
        }
        default:
            return state;
    }
};

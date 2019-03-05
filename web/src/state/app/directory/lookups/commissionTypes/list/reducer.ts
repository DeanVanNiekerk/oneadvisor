import { CommissionType } from '../types';
import { CommissionTypeListAction } from './actions';

export type State = {
    readonly items: CommissionType[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    items: [],
    fetching: false,
};

export const reducer = (
    state: State = defaultState,
    action: CommissionTypeListAction
): State => {
    switch (action.type) {
        case "COMMISSIONTYPES_LIST_RECEIVE": {
            return {
                ...state,
                items: action.payload,
                fetching: false,
            };
        }
        case "COMMISSIONTYPES_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "COMMISSIONTYPES_LIST_FETCHING_ERROR": {
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

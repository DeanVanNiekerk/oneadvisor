import { PageOptions } from '@/app/table';

import { Allocation } from '../types';
import { AllocationListAction } from './actions';

export type State = {
    readonly totalItems: number;
    readonly items: Allocation[];
    readonly fetching: boolean;
};

export const defaultState: State = {
    totalItems: 0,
    items: [],
    fetching: false,
};

export const reducer = (state: State = defaultState, action: AllocationListAction): State => {
    switch (action.type) {
        case "ALLOCATIONS_LIST_RECEIVE": {
            return {
                ...state,
                totalItems: action.payload.totalItems,
                items: action.payload.items,
                fetching: false,
            };
        }
        case "ALLOCATIONS_LIST_FETCHING": {
            return {
                ...state,
                fetching: true,
            };
        }
        case "ALLOCATIONS_LIST_FETCHING_ERROR": {
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

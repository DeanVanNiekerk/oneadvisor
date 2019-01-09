import { ValidationResult } from '@/app/validation';

import { UserSimple } from '../types';
import { UserSimpleAction } from './actions';

export type State = {
    readonly userSimple: UserSimple | null;
    readonly fetching: boolean;
    readonly error: boolean;
};

export const defaultState: State = {
    userSimple: null,
    fetching: false,
    error: false
};

export const reducer = (
    state: State = defaultState,
    action: UserSimpleAction
): State => {
    switch (action.type) {
        case 'USERSSIMPLE_USER_RECEIVE': {
            return {
                ...state,
                userSimple: action.payload,
                fetching: false,
                error: false
            };
        }
        case 'USERSSIMPLE_USER_FETCHING': {
            return {
                ...state,
                fetching: true,
                userSimple: null
            };
        }
        case 'USERSSIMPLE_USER_FETCHING_ERROR': {
            return {
                ...state,
                userSimple: null,
                fetching: false,
                error: true
            };
        }
        default:
            return state;
    }
};
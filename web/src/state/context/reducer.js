// @flow

import { menus } from '@/config/menu';
import { applications } from '@/config/application';
import type { Action } from './actions';
import type { Application, Menus } from './types';

export type State = {
    +applications: Application[],
    +menus: Menus,
    +breadCrumb: string
};

export const defaultState: State = {
    applications: applications,
    menus: menus,
    breadCrumb: ''
};

export const reducer = (state: State = defaultState, action: Action) => {
    switch (action.type) {
        case 'CONTEXT_RECIEVE_BREADCRUMB':
            return {
                ...state,
                breadCrumb: action.payload
            };
        default:
            return state;
    }
};

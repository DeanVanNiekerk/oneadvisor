// @flow

import { menus } from '@/config/menu';
import { applications } from '@/config/application';
import type { Application, Menus } from './types';

type Action = { type: string };

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
        default:
            return state;
    }
};

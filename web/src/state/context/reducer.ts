import { applications } from '@/config/application';
import { menus } from '@/config/menu';

import { Application, Menus } from './types';

type Action = { type: string };

export type State = {
    readonly applications: Application[];
    readonly menus: Menus;
};

export const defaultState: State = {
    applications: applications,
    menus: menus
};

export const reducer = (state: State = defaultState, action: Action) => {
    switch (action.type) {
        default:
            return state;
    }
};

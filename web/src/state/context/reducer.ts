import { applications } from '@/config/application';
import { menus } from '@/config/menu';

import { ContextActions } from './actions';
import { AppInfo, Application, Menus } from './types';

export type State = {
    readonly appInfo: AppInfo | null;
    readonly applications: Application[];
    readonly menus: Menus;
};

export const defaultState: State = {
    appInfo: null,
    applications: applications,
    menus: menus,
};

export const reducer = (
    state: State = defaultState,
    action: ContextActions
) => {
    switch (action.type) {
        case "CONTEXT_APP_INFO_RECEIVE":
            return {
                ...state,
                appInfo: action.payload,
            };
        default:
            return state;
    }
};

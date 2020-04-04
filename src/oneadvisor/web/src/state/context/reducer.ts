import { applications } from "@/config/application";
import { menus } from "@/config/menu";

import { ContextActions } from "./actions";
import { ContextState } from "./types";

export const defaultState: ContextState = {
    appInfo: null,
    organisation: null,
    applications: applications,
    menus: menus,
};

export const reducer = (state: ContextState = defaultState, action: ContextActions) => {
    switch (action.type) {
        case "CONTEXT_APP_INFO_RECEIVE":
            return {
                ...state,
                appInfo: action.payload,
            };
        case "CONTEXT_ORGANISATION_RECEIVE":
            return {
                ...state,
                organisation: action.payload,
            };
        default:
            return state;
    }
};

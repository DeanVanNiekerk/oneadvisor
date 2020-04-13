import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";

import { ApiAction } from "@/app/types";
import { applicationsApi, organisationsApi } from "@/config/api/directory";
import config from "@/config/config";

import { RootState } from "../";
import { signOut, userOrganisationIdSelector } from "../auth";
import { getVersion, setVersion } from "../storage";
import { AppInfo, Application } from "./types";

type ReceiveAppInfoAction = {
    type: "CONTEXT_APP_INFO_RECEIVE";
    payload: AppInfo;
};
type ReceiveUserOrganisationAction = {
    type: "CONTEXT_ORGANISATION_RECEIVE";
    payload: AppInfo;
};
type ApplicationListReceiveAction = {
    type: "CONTEXT_APPLICATIONS_RECEIVE";
    payload: Application[];
};

export type ContextActions =
    | ReceiveAppInfoAction
    | ReceiveUserOrganisationAction
    | ApplicationListReceiveAction;

export const fetchAppInfo = (): ApiAction => {
    return {
        type: "API",
        endpoint: `${config.baseApi}`,
        dispatchPrefix: "CONTEXT_APP_INFO",
        onSuccess: (result: AppInfo, dispatch: Dispatch) => {
            const currentVersion = getVersion();
            setVersion(result.version);
            if (currentVersion != null && currentVersion != result.version) {
                //If version has changed, sign the user out and force reload
                dispatch(signOut());
                setTimeout(() => {
                    location.reload(true);
                }, 500);
            }
        },
    };
};

export const fetchUserOrganisation = (): ThunkAction<void, RootState, {}, ApiAction> => {
    return (dispatch, getState) => {
        const organisationId = userOrganisationIdSelector(getState());

        if (!organisationId) return;

        dispatch({
            type: "API",
            endpoint: `${organisationsApi}/${organisationId}`,
            dispatchPrefix: "CONTEXT_ORGANISATION",
        });
    };
};

export const fetchApplications = (): ApiAction => ({
    type: "API",
    endpoint: applicationsApi,
    dispatchPrefix: "CONTEXT_APPLICATIONS",
});

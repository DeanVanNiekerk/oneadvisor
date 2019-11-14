import { ApiAction } from "@/app/types";
import { applicationsApi } from "@/config/api/directory";

import { Application } from "../types";

type ApplicationListReceiveAction = {
    type: "APPLICATIONS_LIST_RECEIVE";
    payload: Application[];
};
type ApplicationListFetchingAction = { type: "APPLICATIONS_LIST_FETCHING" };
type ApplicationListFetchingErrorAction = {
    type: "APPLICATIONS_LIST_FETCHING_ERROR";
};

export type ApplicationListAction =
    | ApplicationListReceiveAction
    | ApplicationListFetchingAction
    | ApplicationListFetchingErrorAction;

export const fetchApplications = (): ApiAction => ({
    type: "API",
    endpoint: applicationsApi,
    dispatchPrefix: "APPLICATIONS_LIST",
});

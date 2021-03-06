import { Dispatch } from "redux";

import { ApiAction } from "@/app/types";
import { allDirectoryLookupsApi } from "@/config/api/directory";

import {
    Lookups,
    receiveAdviceScopes,
    receiveAdviceServices,
    receiveCompanies,
    receiveLicenseCategories,
    receiveUserTypes,
} from "../";

type LookupsReceiveAction = {
    type: "DIRECTORY_LOOKUPS_RECEIVE";
};
type LookupsFetchingAction = { type: "DIRECTORY_LOOKUPS_FETCHING" };
type LookupsFetchingErrorAction = { type: "DIRECTORY_LOOKUPS_FETCHING_ERROR" };

export type LookupsAction =
    | LookupsReceiveAction
    | LookupsFetchingAction
    | LookupsFetchingErrorAction;

export const fetchAllDirectoryLookups = (): ApiAction => ({
    type: "API",
    endpoint: allDirectoryLookupsApi,
    onSuccess: (payload: Lookups, dispatch: Dispatch) => {
        dispatch(receiveCompanies(payload.companies));
        dispatch(receiveUserTypes(payload.userTypes));
        dispatch(receiveAdviceScopes(payload.adviceScopes));
        dispatch(receiveAdviceServices(payload.adviceServices));
        dispatch(receiveLicenseCategories(payload.licenseCategories));
    },
    dispatchPrefix: "DIRECTORY_LOOKUPS",
});

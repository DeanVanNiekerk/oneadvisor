import { Dispatch } from "redux";

import { ApiAction } from "@/app/types";
import { allCommissionLookupsApi } from "@/config/api/commission";

import {
    Lookups,
    receiveCommissionEarningsTypes,
    receiveCommissionStatementTemplateFieldNames,
    receiveCommissionStatementTemplateGroupFieldNames,
    receiveCommissionTypes,
} from "../";

type LookupsReceiveAction = {
    type: "COMMISSION_LOOKUPS_RECEIVE";
};
type LookupsFetchingAction = { type: "COMMISSION_LOOKUPS_FETCHING" };
type LookupsFetchingErrorAction = { type: "COMMISSION_LOOKUPS_FETCHING_ERROR" };

export type LookupsAction = LookupsReceiveAction | LookupsFetchingAction | LookupsFetchingErrorAction;

export const fetchAllCommissionLookups = (): ApiAction => ({
    type: "API",
    endpoint: allCommissionLookupsApi,
    onSuccess: (payload: Lookups, dispatch: Dispatch) => {
        dispatch(receiveCommissionTypes(payload.commissionTypes));
        dispatch(receiveCommissionEarningsTypes(payload.commissionEarningsTypes));
        dispatch(receiveCommissionStatementTemplateFieldNames(payload.commissionStatementTemplateFieldNames));
        dispatch(receiveCommissionStatementTemplateGroupFieldNames(payload.commissionStatementTemplateGroupFieldNames));
    },
    dispatchPrefix: "COMMISSION_LOOKUPS",
});

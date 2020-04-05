import { ApiAction } from "@/app/types";
import { adviceServicesApi } from "@/config/api/directory";

import { AdviceService } from "../types";

type AdviceServiceListReceiveAction = {
    type: "ADVICESERVICES_LIST_RECEIVE";
    payload: AdviceService[];
};
type AdviceServiceListFetchingAction = { type: "ADVICESERVICES_LIST_FETCHING" };
type AdviceServiceListFetchingErrorAction = {
    type: "ADVICESERVICES_LIST_FETCHING_ERROR";
};

export type AdviceServiceListAction =
    | AdviceServiceListReceiveAction
    | AdviceServiceListFetchingAction
    | AdviceServiceListFetchingErrorAction;

export const receiveAdviceServices = (payload: AdviceService[]): AdviceServiceListAction => ({
    type: "ADVICESERVICES_LIST_RECEIVE",
    payload,
});

export const fetchAdviceServices = (): ApiAction => {
    return {
        type: "API",
        endpoint: adviceServicesApi,
        dispatchPrefix: "ADVICESERVICES_LIST",
    };
};

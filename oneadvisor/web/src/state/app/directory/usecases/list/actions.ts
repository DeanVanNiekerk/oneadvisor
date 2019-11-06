import { ApiAction } from "@/app/types";
import { useCasesApi } from "@/config/api/directory";

import { UseCase } from "../types";

type UseCaseListReceiveAction = {
    type: "USECASES_LIST_RECEIVE";
    payload: UseCase[];
};
type UseCaseListFetchingAction = { type: "USECASES_LIST_FETCHING" };
type UseCaseListFetchingErrorAction = { type: "USECASES_LIST_FETCHING_ERROR" };

export type UseCaseListAction = UseCaseListReceiveAction | UseCaseListFetchingAction | UseCaseListFetchingErrorAction;

export const fetchUseCases = (): ApiAction => ({
    type: "API",
    endpoint: useCasesApi,
    dispatchPrefix: "USECASES_LIST",
});

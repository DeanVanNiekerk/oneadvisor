import { ApiAction } from "@/app/types";
import { companiesApi } from "@/config/api/directory";

import { Company } from "../types";

type CompanyListReceiveAction = {
    type: "COMPANIES_LIST_RECEIVE";
    payload: Company[];
};
type CompanyListFetchingAction = { type: "COMPANIES_LIST_FETCHING" };
type CompanyListFetchingErrorAction = {
    type: "COMPANIES_LIST_FETCHING_ERROR";
};

export type CompanyListAction = CompanyListReceiveAction | CompanyListFetchingAction | CompanyListFetchingErrorAction;

export const receiveCompanies = (payload: Company[]): CompanyListAction => ({
    type: "COMPANIES_LIST_RECEIVE",
    payload,
});

export const fetchCompanies = (): ApiAction => {
    return {
        type: "API",
        endpoint: companiesApi,
        dispatchPrefix: "COMPANIES_LIST",
    };
};

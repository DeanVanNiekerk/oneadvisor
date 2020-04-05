import { ApiAction } from "@/app/types";
import { licenseCategoriesApi } from "@/config/api/directory";

import { LicenseCategory } from "../types";

type LicenseCategoryListReceiveAction = {
    type: "LICENSECATEGORIES_LIST_RECEIVE";
    payload: LicenseCategory[];
};
type LicenseCategoryListFetchingAction = { type: "LICENSECATEGORIES_LIST_FETCHING" };
type LicenseCategoryListFetchingErrorAction = {
    type: "LICENSECATEGORIES_LIST_FETCHING_ERROR";
};

export type LicenseCategoryListAction =
    | LicenseCategoryListReceiveAction
    | LicenseCategoryListFetchingAction
    | LicenseCategoryListFetchingErrorAction;

export const receiveLicenseCategories = (
    payload: LicenseCategory[]
): LicenseCategoryListAction => ({
    type: "LICENSECATEGORIES_LIST_RECEIVE",
    payload,
});

export const fetchLicenseCategories = (): ApiAction => {
    return {
        type: "API",
        endpoint: licenseCategoriesApi,
        dispatchPrefix: "LICENSECATEGORIES_LIST",
    };
};

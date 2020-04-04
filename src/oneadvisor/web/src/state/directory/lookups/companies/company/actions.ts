import { ThunkAction } from "redux-thunk";

import { ApiAction, ApiOnSuccess, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { companiesApi } from "@/config/api/directory";
import { RootState } from "@/state";

import { companyIsModifiedSelector, companySelector } from "../";
import { CompanyEdit } from "../types";

type CompanyReceiveAction = {
    type: "COMPANIES_COMPANY_RECEIVE";
    payload: CompanyEdit | null;
};
type CompanyModifiedAction = {
    type: "COMPANIES_COMPANY_MODIFIED";
    payload: CompanyEdit;
};
type CompanyVisibleAction = {
    type: "COMPANIES_COMPANY_VISIBLE";
    payload: boolean;
};
type CompanyUpdatedAction = {
    type: "COMPANIES_COMPANY_EDIT_RECEIVE";
};
type CompanyUpdatingAction = {
    type: "COMPANIES_COMPANY_EDIT_FETCHING";
};
type CompanyUpdatingErrorAction = {
    type: "COMPANIES_COMPANY_EDIT_FETCHING_ERROR";
};
type CompanyValidationErrorAction = {
    type: "COMPANIES_COMPANY_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type CompanyAction =
    | CompanyModifiedAction
    | CompanyVisibleAction
    | CompanyReceiveAction
    | CompanyUpdatedAction
    | CompanyUpdatingAction
    | CompanyUpdatingErrorAction
    | CompanyValidationErrorAction;

export const receiveCompany = (company: CompanyEdit | null): CompanyReceiveAction => ({
    type: "COMPANIES_COMPANY_RECEIVE",
    payload: company,
});

export const modifyCompany = (company: CompanyEdit): CompanyModifiedAction => ({
    type: "COMPANIES_COMPANY_MODIFIED",
    payload: company,
});

export const companyVisible = (visible: boolean): CompanyVisibleAction => ({
    type: "COMPANIES_COMPANY_VISIBLE",
    payload: visible,
});

export const clearCompany = (): CompanyReceiveAction => receiveCompany(null);

export const newCompany = (): CompanyReceiveAction => {
    const company: CompanyEdit = {
        id: null,
        name: "",
        commissionPolicyNumberPrefixes: [],
    };

    return receiveCompany(company);
};

export const saveCompany = (
    onSaved?: () => void
): ThunkAction<void, RootState, {}, CompanyReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { company } = companySelector(getState());
        if (!company) return;

        const onSuccess = () => {
            dispatch(clearCompany());
            if (onSaved) onSaved();
        };

        if (company.id) {
            dispatch(updateCompany(company, onSuccess));
        } else {
            dispatch(insertCompany(company, onSuccess));
        }
    };
};

export const confirmCancelCompany = (
    showConfirm: ShowConfirm,
    onCancelled: () => void
): ThunkAction<void, RootState, {}, CompanyReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = companyIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearCompany());
            onCancelled();
        };

        if (modifed)
            return showConfirm({
                onOk: () => {
                    cancel();
                },
            });

        cancel();
    };
};

export const updateCompany = (company: CompanyEdit, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${companiesApi}/${company.id}`,
    method: "POST",
    payload: company,
    onSuccess: onSuccess,
    dispatchPrefix: "COMPANIES_COMPANY_EDIT",
});

export const insertCompany = (company: CompanyEdit, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${companiesApi}`,
    method: "POST",
    payload: company,
    onSuccess: onSuccess,
    dispatchPrefix: "COMPANIES_COMPANY_EDIT",
});

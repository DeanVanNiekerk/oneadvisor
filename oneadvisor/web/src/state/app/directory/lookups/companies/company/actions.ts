import { Dispatch } from "redux";

import { ApiAction, ApiOnSuccess, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { companiesApi } from "@/config/api/directory";
import { RootState } from "@/state/rootReducer";

import { companyIsModifiedSelector, companySelector, fetchCompanies } from "../";
import { Company } from "../types";

type CompanyReceiveAction = {
    type: 'COMPANIES_COMPANY_RECEIVE';
    payload: Company | null;
};

type CompanyModifiedAction = {
    type: 'COMPANIES_COMPANY_MODIFIED';
    payload: Company
};

type CompanyUpdatedAction = {
    type: 'COMPANIES_COMPANY_EDIT_RECEIVE';
};
type CompanyUpdatingAction = {
    type: 'COMPANIES_COMPANY_EDIT_FETCHING';
};
type CompanyUpdatingErrorAction = {
    type: 'COMPANIES_COMPANY_EDIT_FETCHING_ERROR';
};
type CompanyValidationErrorAction = {
    type: 'COMPANIES_COMPANY_EDIT_VALIDATION_ERROR';
    payload: ValidationResult[];
};

export type CompanyAction =
    | CompanyModifiedAction
    | CompanyReceiveAction
    | CompanyUpdatedAction
    | CompanyUpdatingAction
    | CompanyUpdatingErrorAction
    | CompanyValidationErrorAction;

export const receiveCompany = (company: Company): CompanyReceiveAction => ({
    type: 'COMPANIES_COMPANY_RECEIVE',
    payload: company
});

export const modifyCompany = (company: Company): CompanyModifiedAction => ({
    type: 'COMPANIES_COMPANY_MODIFIED',
    payload: company
});

export const clearCompany = (): CompanyReceiveAction => ({
    type: 'COMPANIES_COMPANY_RECEIVE',
    payload: null
});

export const newCompany = (): CompanyReceiveAction => ({
    type: 'COMPANIES_COMPANY_RECEIVE',
    payload: {
        id: "",
        name: "",
        commissionPolicyNumberPrefixes: [""],
    }
});

export const saveCompany = () => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const { company } = companySelector(getState());
        if (!company) return;

        const onSuccess = () => {
            dispatch(clearCompany());
            dispatch(fetchCompanies());
        }

        if (company.id) {
            dispatch(updateCompany(company, onSuccess));
        } else {
            dispatch(insertCompany(company, onSuccess));
        }
    };
}

export const confirmCancel = (showConfirm: ShowConfirm) => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const modifed = companyIsModifiedSelector(getState());

        const close = () => dispatch(clearCompany());

        if (modifed)
            return showConfirm({ onOk: () => { close(); } });

        close();
    };
}

export const updateCompany = (
    company: Company,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${companiesApi}/${company.id}`,
    method: 'POST',
    payload: company,
    onSuccess: onSuccess,
    dispatchPrefix: 'COMPANIES_COMPANY_EDIT'
});

export const insertCompany = (
    company: Company,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${companiesApi}`,
    method: 'POST',
    payload: company,
    onSuccess: onSuccess,
    dispatchPrefix: 'COMPANIES_COMPANY_EDIT'
});

import { ApiAction, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { companiesApi } from '@/config/api/directory';

import { Company } from '../types';

type CompanyReceiveAction = {
    type: 'COMPANIES_COMPANY_RECEIVE';
    payload: Company;
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
    | CompanyReceiveAction
    | CompanyUpdatedAction
    | CompanyUpdatingAction
    | CompanyUpdatingErrorAction
    | CompanyValidationErrorAction;

export const receiveCompany = (company: Company): CompanyReceiveAction => ({
    type: 'COMPANIES_COMPANY_RECEIVE',
    payload: company
});

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

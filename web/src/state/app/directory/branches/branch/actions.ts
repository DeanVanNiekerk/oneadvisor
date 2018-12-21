import { ApiAction, ApiOnSuccess } from '@/app/types';
import { ValidationResult } from '@/app/validation';
import { branchesApi } from '@/config/api/directory';

import { Branch } from '../types';

type BranchReceiveAction = {
    type: 'BRANCHES_BRANCH_RECEIVE';
    payload: Branch | null;
};
type BranchFetchingAction = {
    type: 'BRANCHES_BRANCH_FETCHING';
};
type BranchFetchingErrorAction = {
    type: 'BRANCHES_BRANCH_FETCHING_ERROR';
};

type BranchUpdatedAction = {
    type: 'BRANCHES_BRANCH_EDIT_RECEIVE';
};
type BranchUpdatingAction = {
    type: 'BRANCHES_BRANCH_EDIT_FETCHING';
};
type BranchUpdatingErrorAction = {
    type: 'BRANCHES_BRANCH_EDIT_FETCHING_ERROR';
};
type BranchValidationErrorAction = {
    type: 'BRANCHES_BRANCH_EDIT_VALIDATION_ERROR';
    payload: ValidationResult[];
};

export type BranchAction =
    | BranchReceiveAction
    | BranchFetchingAction
    | BranchFetchingErrorAction
    | BranchUpdatedAction
    | BranchUpdatingAction
    | BranchUpdatingErrorAction
    | BranchValidationErrorAction;

export const receiveBranch = (branch: Branch | null): BranchReceiveAction => ({
    type: 'BRANCHES_BRANCH_RECEIVE',
    payload: branch
});

export const fetchBranch = (branchId: string): ApiAction => ({
    type: 'API',
    endpoint: `${branchesApi}/${branchId}`,
    dispatchPrefix: 'BRANCHES_BRANCH'
});

export const updateBranch = (
    branch: Branch,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${branchesApi}/${branch.id}`,
    method: 'POST',
    payload: branch,
    onSuccess: onSuccess,
    dispatchPrefix: 'BRANCHES_BRANCH_EDIT'
});

export const insertBranch = (
    branch: Branch,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: 'API',
    endpoint: `${branchesApi}`,
    method: 'POST',
    payload: branch,
    onSuccess: onSuccess,
    dispatchPrefix: 'BRANCHES_BRANCH_EDIT'
});

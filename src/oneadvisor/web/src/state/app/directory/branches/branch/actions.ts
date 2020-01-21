import { ThunkAction } from "redux-thunk";

import { ApiAction, ApiOnSuccess, Result, ShowConfirm } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { branchesApi } from "@/config/api/directory";
import { RootState } from "@/state/rootReducer";

import { branchIsModifiedSelector, branchSelector } from "../";
import { Branch } from "../types";

type BranchReceiveAction = {
    type: "BRANCHES_BRANCH_RECEIVE";
    payload: Branch | null;
};
type BranchModifiedAction = {
    type: "BRANCHES_BRANCH_MODIFIED";
    payload: Branch | null;
};
type BranchVisibleAction = {
    type: "BRANCHES_BRANCH_VISIBLE";
    payload: boolean;
};
type BranchFetchingAction = {
    type: "BRANCHES_BRANCH_FETCHING";
};
type BranchFetchingErrorAction = {
    type: "BRANCHES_BRANCH_FETCHING_ERROR";
};
type BranchUpdatedAction = {
    type: "BRANCHES_BRANCH_EDIT_RECEIVE";
};
type BranchUpdatingAction = {
    type: "BRANCHES_BRANCH_EDIT_FETCHING";
};
type BranchUpdatingErrorAction = {
    type: "BRANCHES_BRANCH_EDIT_FETCHING_ERROR";
};
type BranchValidationErrorAction = {
    type: "BRANCHES_BRANCH_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type BranchAction =
    | BranchVisibleAction
    | BranchModifiedAction
    | BranchReceiveAction
    | BranchFetchingAction
    | BranchFetchingErrorAction
    | BranchUpdatedAction
    | BranchUpdatingAction
    | BranchUpdatingErrorAction
    | BranchValidationErrorAction;

export const receiveBranch = (branch: Branch | null): BranchReceiveAction => ({
    type: "BRANCHES_BRANCH_RECEIVE",
    payload: branch,
});

export const modifyBranch = (branch: Branch): BranchModifiedAction => ({
    type: "BRANCHES_BRANCH_MODIFIED",
    payload: branch,
});

export const branchVisible = (visible: boolean): BranchVisibleAction => ({
    type: "BRANCHES_BRANCH_VISIBLE",
    payload: visible,
});

export const fetchBranch = (branchId: string, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${branchesApi}/${branchId}`,
    onSuccess: onSuccess,
    dispatchPrefix: "BRANCHES_BRANCH",
});

export const clearBranch = (): BranchReceiveAction => receiveBranch(null);

export const saveBranch = (
    onSaved?: (branch: Branch) => void
): ThunkAction<void, RootState, {}, BranchReceiveAction | ApiAction> => {
    return (dispatch, getState) => {
        const { branch } = branchSelector(getState());
        if (!branch) return;

        const onSuccess = (branchEdit: Branch) => {
            dispatch(clearBranch());
            if (onSaved) onSaved(branchEdit);
        };

        if (branch.id) {
            dispatch(
                updateBranch(branch, () => {
                    onSuccess(branch);
                })
            );
        } else {
            dispatch(
                insertBranch(branch, result => {
                    onSuccess(result.tag);
                })
            );
        }
    };
};

export const confirmCancelBranch = (
    showConfirm: ShowConfirm,
    onCancelled: () => void
): ThunkAction<void, RootState, {}, BranchReceiveAction> => {
    return (dispatch, getState) => {
        const modifed = branchIsModifiedSelector(getState());

        const cancel = () => {
            dispatch(clearBranch());
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

export const updateBranch = (branch: Branch, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${branchesApi}/${branch.id}`,
    method: "POST",
    payload: branch,
    onSuccess: onSuccess,
    dispatchPrefix: "BRANCHES_BRANCH_EDIT",
});

export const insertBranch = (
    branch: Branch,
    onSuccess?: ApiOnSuccess<Result<Branch>>
): ApiAction => ({
    type: "API",
    endpoint: `${branchesApi}`,
    method: "POST",
    payload: branch,
    onSuccess: onSuccess,
    dispatchPrefix: "BRANCHES_BRANCH_EDIT",
});

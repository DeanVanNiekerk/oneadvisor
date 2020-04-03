import { ApiAction, ApiOnSuccess } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { allocationsApi } from "@/config/api/commission";

import { AllocationEdit } from "../types";

type AllocationReceiveAction = {
    type: "ALLOCATIONS_ALLOCATION_RECEIVE";
    payload: AllocationEdit | null;
};
type AllocationFetchingAction = {
    type: "ALLOCATIONS_ALLOCATION_FETCHING";
};
type AllocationFetchingErrorAction = {
    type: "ALLOCATIONS_ALLOCATION_FETCHING_ERROR";
};

type AllocationUpdatedAction = {
    type: "ALLOCATIONS_ALLOCATION_EDIT_RECEIVE";
};
type AllocationUpdatingAction = {
    type: "ALLOCATIONS_ALLOCATION_EDIT_FETCHING";
};
type AllocationUpdatingErrorAction = {
    type: "ALLOCATIONS_ALLOCATION_EDIT_FETCHING_ERROR";
};
type AllocationValidationErrorAction = {
    type: "ALLOCATIONS_ALLOCATION_EDIT_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type AllocationAction =
    | AllocationReceiveAction
    | AllocationFetchingAction
    | AllocationFetchingErrorAction
    | AllocationUpdatedAction
    | AllocationUpdatingAction
    | AllocationUpdatingErrorAction
    | AllocationValidationErrorAction;

export const receiveAllocation = (allocation: AllocationEdit | null): AllocationReceiveAction => ({
    type: "ALLOCATIONS_ALLOCATION_RECEIVE",
    payload: allocation,
});

export const fetchAllocation = (allocationId: string): ApiAction => ({
    type: "API",
    endpoint: `${allocationsApi}/${allocationId}`,
    dispatchPrefix: "ALLOCATIONS_ALLOCATION",
});

export const updateAllocation = (
    allocation: AllocationEdit,
    onSuccess?: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${allocationsApi}/${allocation.id}`,
    method: "POST",
    payload: allocation,
    onSuccess: onSuccess,
    dispatchPrefix: "ALLOCATIONS_ALLOCATION_EDIT",
});

export const insertAllocation = (
    allocation: AllocationEdit,
    onSuccess: ApiOnSuccess
): ApiAction => ({
    type: "API",
    endpoint: `${allocationsApi}`,
    method: "POST",
    payload: allocation,
    onSuccess: onSuccess,
    dispatchPrefix: "ALLOCATIONS_ALLOCATION_EDIT",
});

export const deleteAllocation = (allocationId: string, onSuccess?: ApiOnSuccess): ApiAction => ({
    type: "API",
    endpoint: `${allocationsApi}/${allocationId}`,
    method: "DELETE",
    onSuccess: onSuccess,
});

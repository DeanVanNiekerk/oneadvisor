import { Dispatch } from "redux";

import { ValidationResult } from "../validation";

type ApiActionType = "API";
type ApiMethods = "GET" | "POST" | "DELETE";
export type ApiOnSuccess<T = unknown> = (result: T, dispatch: Dispatch) => void;
export type ApiOnFailure<T = unknown> = (result: T) => void;
export type ApiOnValidationFailure = (
    validationResults: ValidationResult[],
    dispatch: Dispatch
) => void;
export type ApiOnSuccessBlob = (blob: Blob, dispatch: Dispatch) => void;
export type ApiAction = {
    type: ApiActionType;
    endpoint: string;
    dispatchPrefix?: string;
    method?: ApiMethods;
    payload?: Record<string, unknown>;
    onSuccess?: ApiOnSuccess;
    onSuccessBlob?: ApiOnSuccessBlob;
    hideNotifications?: boolean;
    hideValidationNotifications?: boolean;
    onFailure?: ApiOnFailure;
    onValidationFailure?: ApiOnValidationFailure;
    onAlways?: () => void;
};

export type Result<T = null> = {
    success: boolean;
    errors: string[];
    validationFailures: ValidationResult[];
    tag: T;
};

import { Dispatch } from 'redux';

type ApiActionType = "API";
type ApiMethods = "GET" | "POST" | "DELETE";
export type ApiOnSuccess = (result: any, dispatch: Dispatch) => void;
export type ApiOnFailure = (result: any) => void;
export type ApiOnSuccessBlob = (blob: Blob, dispatch: Dispatch) => void;
export type ApiAction = {
    type: ApiActionType;
    endpoint: string;
    dispatchPrefix?: string;
    method?: ApiMethods;
    payload?: Object;
    onSuccess?: ApiOnSuccess;
    onSuccessBlob?: ApiOnSuccessBlob;
    hideNotifications?: boolean;
    hideValidationNotifications?: boolean;
    onFailure?: ApiOnFailure;
};

export type Result = {
    success: boolean;
    tag: any;
};

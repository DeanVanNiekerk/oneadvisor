import { Dispatch } from 'redux';

type ApiActionType = 'API';
type ApiMethods = 'GET' | 'POST' | 'DELETE';
export type ApiOnSuccessJson = (data: any, dispatch: Dispatch) => void;
export type ApiOnSuccessBlob = (blob: Blob, dispatch: Dispatch) => void;
export type ApiAction = {
    type: ApiActionType;
    endpoint: string;
    dispatchPrefix?: string;
    method?: ApiMethods;
    payload?: Object;
    onSuccess?: ApiOnSuccessJson;
    onSuccessBlob?: ApiOnSuccessBlob;
};

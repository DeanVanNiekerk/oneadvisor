type ApiActionType = 'API';
type ApiMethods = 'GET' | 'POST';
export type ApiOnSuccess = () => void;
export type ApiAction = {
    type: ApiActionType;
    endpoint: string;
    dispatchPrefix: string;
    method?: ApiMethods;
    payload?: Object;
    onSuccess?: ApiOnSuccess;
};

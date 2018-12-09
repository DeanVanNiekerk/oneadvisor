

type ApiActionType = 'API';
type ApiMethods = 'GET' | 'POST';
export type ApiOnSuccess = () => void;
export type ApiAction = {
    type: ApiActionType,
    endpoint: string,
    dispatchPrefix: string,
    method?: ApiMethods,
    payload?: Object,
    onSuccess?: ApiOnSuccess
};

export type ValidationResult = {
    propertyName: string,
    errorMessage: string,
    severity: number,
    errorCode: string,
    attemptedValue: any
};

export type PagedItems<T> = {
    totalItems: number,
    items: Array<T>
};

export type PageOptions = {
    number: number,
    size: number
};

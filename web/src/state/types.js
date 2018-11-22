// @flow

export type RouterState = {
    location: {
        pathname: string
    }
};

export type RouterProps = {
    history: {
        push: (path: string) => void
    },
    location: {
        pathname: string
    },
    match: {
        params: {
            [key: string]: string
        }
    }
};

export type ReduxProps = {
    dispatch: (action: any) => void
};

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
    attemptedValue: string
};

export type PagedItems<T> = {
    totalItems: number,
    items: Array<T>
};

export type PageOptions = {
    number: number,
    size: number
};

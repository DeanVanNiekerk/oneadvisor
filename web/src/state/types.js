// @flow

export type Dispatch = (action: any) => void;

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

import { getToken, setToken } from '@/state/storage';

import { decodeToken } from '../helpers';
import { TokenData } from '../types';
import { TokenActions } from './actions';

export type State = {
    readonly token: string | null;
    readonly tokenData: TokenData | null;
};

export const defaultState = {
    token: getToken(),
    tokenData: decodeToken(getToken()),
};

export const reducer = (state: State = defaultState, action: TokenActions) => {
    switch (action.type) {
        case "AUTH_TOKEN_RECEIVE": {
            setToken(action.payload);
            return {
                ...state,
                token: action.payload,
                tokenData: decodeToken(action.payload),
            };
        }
        default:
            return state;
    }
};

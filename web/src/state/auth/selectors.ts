import jwt_decode from 'jwt-decode';
import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';
import { AccessTokenData, IdTokenData, UserInfo } from './types';

const rootSelector = (state: RootState): State => state.auth;

export const authSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

export const userInfoSelector: (
    state: RootState
) => UserInfo | null = createSelector(
    authSelector,
    auth => auth.userInfo
);

export const accessTokenDataSelector: (
    state: RootState
) => AccessTokenData | null = createSelector(
    authSelector,
    auth => {
        if (auth.accessToken)
            return jwt_decode<AccessTokenData>(auth.accessToken);
        return null;
    }
);

export const idTokenDataSelector: (
    state: RootState
) => IdTokenData | null = createSelector(
    authSelector,
    auth => {
        if (auth.idToken) return jwt_decode<IdTokenData>(auth.idToken);
        return null;
    }
);

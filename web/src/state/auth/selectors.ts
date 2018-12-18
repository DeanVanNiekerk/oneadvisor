import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';
import { UserInfo } from './types';

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

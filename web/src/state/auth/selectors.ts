import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';

const rootSelector = (state: RootState): State => state.auth;

export const authSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

export const isAuthenticatedSelector: (
    state: RootState
) => boolean = createSelector(
    authSelector,
    root => {
        return root.token != null;
    }
);

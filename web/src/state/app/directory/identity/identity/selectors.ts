import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.directory.identity.identity;

export const identitySelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.directory.branches.branch;

export const branchSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

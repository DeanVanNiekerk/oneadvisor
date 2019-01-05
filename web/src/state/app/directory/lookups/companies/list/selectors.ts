import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.directory.lookups.companies.list;

export const listSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

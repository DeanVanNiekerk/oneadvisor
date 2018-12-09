

import { createSelector } from 'reselect';
import { State as RootState } from '@/state/rootReducer';
import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.directory.organisations.list;

export const listSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

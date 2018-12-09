

import { createSelector } from 'reselect';
import { State as RootState } from '@/state/rootReducer';
import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.directory.organisations.organisation;

export const organisationSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

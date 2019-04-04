import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';

const rootSelector = (state: RootState): State => state.app.client.lookups.all;

export const lookupsSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

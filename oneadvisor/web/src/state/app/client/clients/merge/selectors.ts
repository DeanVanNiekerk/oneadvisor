import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.client.clients.merge;

export const clientMergeSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);
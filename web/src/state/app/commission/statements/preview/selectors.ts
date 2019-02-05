import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.commission.statements.preview;

export const statementPreviewSelector: (
    state: RootState
) => State = createSelector(
    rootSelector,
    root => root
);

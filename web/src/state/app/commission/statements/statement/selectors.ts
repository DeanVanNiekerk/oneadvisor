import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.commission.statements.statement;

export const statementSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

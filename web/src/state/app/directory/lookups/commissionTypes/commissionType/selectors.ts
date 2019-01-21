import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.directory.lookups.commissionTypes.commissionType;

export const commissionTypeSelector: (
    state: RootState
) => State = createSelector(
    rootSelector,
    root => root
);

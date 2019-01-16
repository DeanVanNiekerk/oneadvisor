import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.member.policies.policy;

export const policySelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

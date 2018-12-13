import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.member.members.member;

export const memberSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

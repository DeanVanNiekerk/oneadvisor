import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.member.members.preview;

export const memberPreviewSelector: (
    state: RootState
) => State = createSelector(
    rootSelector,
    root => root
);

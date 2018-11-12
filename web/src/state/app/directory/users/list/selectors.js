// @flow

import { createSelector } from 'reselect';
import type { State as RootState } from '@/state/rootReducer';
import type { User } from '../types';
import type { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.directory.users.list;

export const listSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

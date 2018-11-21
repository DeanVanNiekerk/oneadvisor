// @flow

import { createSelector } from 'reselect';
import type { State as RootState } from '@/state/rootReducer';
import type { Organisation } from '../types';
import type { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.directory.organisations.organisation;

export const organisationSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

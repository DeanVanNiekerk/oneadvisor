// @flow

import { createSelector } from 'reselect';
import type { State as RootState } from '@/state/rootReducer';
import type { RouterProps } from '@/state/types';
import type { User } from '../types';
import type { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.directory.users.list;

export const listSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

const getCurrentUserId = (state: RootState, props: RouterProps) =>
    props.match.params.userId;

export const getCachedUser: (
    state: RootState,
    props: RouterProps
) => ?User = createSelector(
    [rootSelector, getCurrentUserId],
    (root, userId) => {
        return root.items.find(u => u.id === userId);
    }
);

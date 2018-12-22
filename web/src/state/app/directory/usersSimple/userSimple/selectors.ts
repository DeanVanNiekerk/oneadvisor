import { createSelector } from 'reselect';

import { RootState } from '@/state/rootReducer';

import { identitySelector } from '../../identity';
import { State } from './reducer';

const rootSelector = (state: RootState): State =>
    state.app.directory.usersSimple.userSimple;

export const userSimpleSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

export const userSimpleIsIdentity: (
    state: RootState
) => boolean = createSelector(
    identitySelector,
    rootSelector,
    ({ identity }, { userSimple }) => {
        if (!identity || !userSimple) return false;

        return identity.id === userSimple.id;
    }
);

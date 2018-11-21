// @flow

import { combineReducers } from 'redux';
import type { CombinedReducer } from 'redux';

import { reducer as users } from './users/reducer';
import type {
    State as UsersState,
    Action as UsersAction
} from './users/reducer';

import { reducer as organisations } from './organisations/reducer';
import type {
    State as OrganisationsState,
    Action as OrganisationsAction
} from './organisations/reducer';

export type Action = UsersAction | OrganisationsAction;

export type State = {
    users: UsersState,
    organisations: OrganisationsState
};

export const reducer: CombinedReducer<State, Action> = combineReducers({
    users: users,
    organisations: organisations
});

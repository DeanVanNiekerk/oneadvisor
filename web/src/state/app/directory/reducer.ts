

import { combineReducers } from 'redux';

import { reducer as users } from './users/reducer';
import {
    State as UsersState,
    Action as UsersAction
} from './users/reducer';

import { reducer as organisations } from './organisations/reducer';
import {
    State as OrganisationsState,
    Action as OrganisationsAction
} from './organisations/reducer';

export type Action = UsersAction | OrganisationsAction;

export type State = {
    users: UsersState,
    organisations: OrganisationsState
};

export const reducer = combineReducers({
    users: users,
    organisations: organisations
});

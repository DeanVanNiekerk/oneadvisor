import { combineReducers } from 'redux';

import {
    Action as ApplicationsAction, reducer as applications,
    State as ApplicationsState
} from './applications/reducer';
import {
    Action as OrganisationsAction, reducer as organisations,
    State as OrganisationsState
} from './organisations/reducer';
import {
    Action as RolesAction, reducer as roles, State as RolesState
} from './roles/reducer';
import {
    Action as UsersAction, reducer as users, State as UsersState
} from './users/reducer';

export type Action = UsersAction | OrganisationsAction | RolesAction | ApplicationsAction;

export type State = {
    users: UsersState,
    organisations: OrganisationsState,
    roles: RolesState,
    applications: ApplicationsState
};

export const reducer = combineReducers({
    users: users,
    organisations: organisations,
    roles: roles,
    applications: applications
});

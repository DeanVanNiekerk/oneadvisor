import { combineReducers } from 'redux';

import {
    Action as ApplicationsAction, reducer as applications, State as ApplicationsState
} from './applications/reducer';
import { Action as IdentityAction, reducer as identity, State as IdentityState } from './identity/reducer';
import {
    Action as OrganisationsAction, reducer as organisations, State as OrganisationsState
} from './organisations/reducer';
import { Action as RolesAction, reducer as roles, State as RolesState } from './roles/reducer';
import { Action as UseCasesAction, reducer as useCases, State as UseCasesState } from './usecases/reducer';
import { Action as UsersAction, reducer as users, State as UsersState } from './users/reducer';

export type Action =
    | UsersAction
    | OrganisationsAction
    | RolesAction
    | ApplicationsAction
    | UseCasesAction
    | IdentityAction;

export type State = {
    users: UsersState;
    organisations: OrganisationsState;
    roles: RolesState;
    applications: ApplicationsState;
    useCases: UseCasesState;
    identity: IdentityState;
};

export const reducer = combineReducers({
    users: users,
    organisations: organisations,
    roles: roles,
    applications: applications,
    useCases: useCases,
    identity: identity
});

import { combineReducers } from 'redux';

import {
    Action as ApplicationsAction, reducer as applications, State as ApplicationsState
} from './applications/reducer';
import { Action as BranchesAction, reducer as branches, State as BranchesState } from './branches/reducer';
import { Action as IdentityAction, reducer as identity, State as IdentityState } from './identity/reducer';
import {
    Action as OrganisationsAction, reducer as organisations, State as OrganisationsState
} from './organisations/reducer';
import { Action as RolesAction, reducer as roles, State as RolesState } from './roles/reducer';
import { Action as UseCasesAction, reducer as useCases, State as UseCasesState } from './usecases/reducer';
import { Action as UsersAction, reducer as users, State as UsersState } from './users/reducer';
import { Action as UsersSimpleAction, reducer as usersSimple, State as UsersSimpleState } from './usersSimple/reducer';

export type Action =
    | UsersAction
    | UsersSimpleAction
    | OrganisationsAction
    | RolesAction
    | ApplicationsAction
    | UseCasesAction
    | IdentityAction
    | BranchesAction;

export type State = {
    users: UsersState;
    usersSimple: UsersSimpleState;
    organisations: OrganisationsState;
    roles: RolesState;
    applications: ApplicationsState;
    useCases: UseCasesState;
    identity: IdentityState;
    branches: BranchesState;
};

export const reducer = combineReducers({
    users: users,
    usersSimple: usersSimple,
    organisations: organisations,
    roles: roles,
    applications: applications,
    useCases: useCases,
    identity: identity,
    branches: branches
});

import { combineReducers } from 'redux';

import { reducer as applications, State as ApplicationsState } from './applications/reducer';
import { reducer as audit, State as AuditState } from './audit/reducer';
import { reducer as branches, State as BranchesState } from './branches/reducer';
import { reducer as lookups, State as LookupsState } from './lookups/reducer';
import { reducer as organisations, State as OrganisationsState } from './organisations/reducer';
import { reducer as roles, State as RolesState } from './roles/reducer';
import { reducer as useCases, State as UseCasesState } from './usecases/reducer';
import { reducer as users, State as UsersState } from './users/reducer';
import { reducer as usersSimple, State as UsersSimpleState } from './usersSimple/reducer';

export type State = {
    users: UsersState;
    usersSimple: UsersSimpleState;
    organisations: OrganisationsState;
    roles: RolesState;
    applications: ApplicationsState;
    useCases: UseCasesState;
    branches: BranchesState;
    lookups: LookupsState;
    audit: AuditState;
};

export const reducer = combineReducers({
    users: users,
    usersSimple: usersSimple,
    organisations: organisations,
    roles: roles,
    applications: applications,
    useCases: useCases,
    branches: branches,
    lookups: lookups,
    audit: audit,
});
import { combineReducers } from "redux";

import { reducer as applications, State as ApplicationsState } from "./applications/reducer";
import { reducer as audit, State as AuditState } from "./audit/reducer";
import { reducer as branches, State as BranchesState } from "./branches/reducer";
import { reducer as branchesSimple, State as BranchesSimpleState } from "./branchesSimple/reducer";
import { reducer as changeLogs, State as ChangeLogsState } from "./changeLogs/reducer";
import { reducer as lookups, State as LookupsState } from "./lookups/reducer";
import { reducer as organisations, State as OrganisationsState } from "./organisations/reducer";
import { reducer as roles, State as RolesState } from "./roles/reducer";
import { reducer as useCases, State as UseCasesState } from "./usecases/reducer";
import { reducer as users, State as UsersState } from "./users/reducer";
import { reducer as usersSimple, State as UsersSimpleState } from "./usersSimple/reducer";

export type State = {
    users: UsersState;
    usersSimple: UsersSimpleState;
    organisations: OrganisationsState;
    roles: RolesState;
    applications: ApplicationsState;
    useCases: UseCasesState;
    branches: BranchesState;
    branchesSimple: BranchesSimpleState;
    lookups: LookupsState;
    audit: AuditState;
    changeLogs: ChangeLogsState;
};

export const reducer = combineReducers({
    users: users,
    usersSimple: usersSimple,
    organisations: organisations,
    roles: roles,
    applications: applications,
    useCases: useCases,
    branches: branches,
    branchesSimple: branchesSimple,
    lookups: lookups,
    audit: audit,
    changeLogs: changeLogs,
});

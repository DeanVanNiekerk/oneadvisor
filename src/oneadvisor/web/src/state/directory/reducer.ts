import { combineReducers } from "redux";

import { reducer as applications } from "./applications/reducer";
import { reducer as audit } from "./audit/reducer";
import { reducer as branches } from "./branches/reducer";
import { reducer as branchesSimple } from "./branchesSimple/reducer";
import { reducer as changeLogs } from "./changeLogs/reducer";
import { reducer as lookups } from "./lookups/reducer";
import { reducer as organisations } from "./organisations/reducer";
import { reducer as roles } from "./roles/reducer";
import { DirectoryState } from "./types";
import { reducer as useCases } from "./usecases/reducer";
import { reducer as users } from "./users/reducer";
import { reducer as usersSimple } from "./usersSimple/reducer";

export const reducer = combineReducers<DirectoryState>({
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

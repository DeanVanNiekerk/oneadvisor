import { combineReducers } from "redux";

import { reducer as audit } from "./audit/reducer";
import { reducer as branches } from "./branches/reducer";
import { reducer as changeLogs } from "./changeLogs/reducer";
import { reducer as organisations } from "./organisations/reducer";
import { reducer as roles } from "./roles/reducer";
import { DirectoryState } from "./types";
import { reducer as useCases } from "./usecases/reducer";
import { reducer as users } from "./users/reducer";

export const reducer = combineReducers<DirectoryState>({
    users: users,
    organisations: organisations,
    roles: roles,
    useCases: useCases,
    branches: branches,
    audit: audit,
    changeLogs: changeLogs,
});

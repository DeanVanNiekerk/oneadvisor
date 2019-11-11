import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.directory.roles.role;

export const roleSelector: (state: RootState) => State = createSelector(rootSelector, root => root);

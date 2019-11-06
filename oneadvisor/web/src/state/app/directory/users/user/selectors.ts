import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.app.directory.users.user;

export const userSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

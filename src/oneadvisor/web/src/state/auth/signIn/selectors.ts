import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.auth.signIn;

export const signInSelector: (state: RootState) => State = createSelector(
    rootSelector,
    root => root
);

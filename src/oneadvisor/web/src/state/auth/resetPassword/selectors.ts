import { createSelector } from "reselect";

import { RootState } from "@/state/rootReducer";

import { State } from "./reducer";

const rootSelector = (state: RootState): State => state.auth.resetPassword;

export const resetPasswordSelector: (state: RootState) => State = createSelector(
    rootSelector,
    (root) => root
);

import { createSelector } from "reselect";

import { RootState } from "@/state";

import { SignInState } from "../types";

const rootSelector = (state: RootState): SignInState => state.auth.signIn;

export const signInSelector: (state: RootState) => SignInState = createSelector(
    rootSelector,
    (root) => root
);

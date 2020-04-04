import { createSelector } from "reselect";

import { RootState } from "@/state";

import { ResetPasswordState } from "../";

const rootSelector = (state: RootState): ResetPasswordState => state.auth.resetPassword;

export const resetPasswordSelector: (state: RootState) => ResetPasswordState = createSelector(
    rootSelector,
    (root) => root
);

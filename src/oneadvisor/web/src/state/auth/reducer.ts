import { combineReducers } from "redux";

import { reducer as resetPassword } from "./resetPassword/reducer";
import { reducer as signIn } from "./signIn/reducer";
import { reducer as token } from "./token/reducer";
import { AuthState } from "./types";

export const reducer = combineReducers<AuthState>({
    resetPassword: resetPassword,
    signIn: signIn,
    token: token,
});

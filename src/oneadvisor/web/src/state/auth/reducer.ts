import { combineReducers } from "redux";

import { AuthState } from "./";
import { reducer as resetPassword } from "./resetPassword/reducer";
import { reducer as signIn } from "./signIn/reducer";
import { reducer as token } from "./token/reducer";

export const reducer = combineReducers<AuthState>({
    resetPassword: resetPassword,
    signIn: signIn,
    token: token,
});

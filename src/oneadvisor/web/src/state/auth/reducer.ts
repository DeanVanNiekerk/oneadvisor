import { combineReducers } from "redux";

import { reducer as resetPassword, State as ResetPasswordState } from "./resetPassword/reducer";
import { reducer as signIn, State as SignInState } from "./signIn/reducer";
import { reducer as token, State as TokenState } from "./token/reducer";

export type State = {
    resetPassword: ResetPasswordState;
    signIn: SignInState;
    token: TokenState;
};

export const reducer = combineReducers({
    resetPassword: resetPassword,
    signIn: signIn,
    token: token,
});

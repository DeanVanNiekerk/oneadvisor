import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import { ApiAction } from "@/app/types";
import { ValidationResult } from "@/app/validation";
import { signInApi } from "@/config/api/account";
import { RootState } from "@/state";
import { fetchUserOrganisation } from "@/state/context/actions";

import { recieveToken } from "../token/actions";
import { Credentials } from "../types";

type SignInAction = {
    type: "AUTH_SIGNIN_RECEIVE";
    payload: { token: string | null };
};
type SigningInAction = {
    type: "AUTH_SIGNIN_FETCHING";
};
type SigningInErrorAction = {
    type: "AUTH_SIGNIN_FETCHING_ERROR";
};
type SignInValidationErrorAction = {
    type: "AUTH_SIGNIN_VALIDATION_ERROR";
    payload: ValidationResult[];
};

export type SignInActions =
    | SignInAction
    | SigningInAction
    | SigningInErrorAction
    | SignInValidationErrorAction;

export const signIn = (credentials: Credentials): ApiAction => ({
    type: "API",
    endpoint: `${signInApi}`,
    method: "POST",
    payload: credentials,
    dispatchPrefix: "AUTH_SIGNIN",
    hideNotifications: true,
    onSuccess: (result: { token: string }, dispatch: ThunkDispatch<RootState, {}, AnyAction>) => {
        dispatch(recieveToken(result.token));
        dispatch(fetchUserOrganisation());
    },
});

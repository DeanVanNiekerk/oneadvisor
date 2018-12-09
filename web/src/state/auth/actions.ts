

import { UserInfo } from './types'

type AuthReceiveAction = { type: "AUTH_RECIEVE_AUTHENTICATION", payload: { userInfo: UserInfo, idToken: string, accessToken: string } };
type AuthClearAction = { type: "AUTH_RECIEVE_AUTHENTICATION_CLEAR" };

export type Action = 
    | AuthReceiveAction
    | AuthClearAction

export const recieveAuthentication = (userInfo: UserInfo, idToken: string, accessToken: string): AuthReceiveAction => ({
    type: "AUTH_RECIEVE_AUTHENTICATION",
    payload: { userInfo, idToken, accessToken }
})

export const clearAuthentication = (): AuthClearAction => ({
    type: "AUTH_RECIEVE_AUTHENTICATION_CLEAR"
})
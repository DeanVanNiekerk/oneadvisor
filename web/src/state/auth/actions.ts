import { UserInfo } from './types';

type AuthReceiveAction = {
    type: 'AUTH_RECIEVE_AUTHENTICATION';
    payload: { userInfo: UserInfo; idToken: string; accessToken: string };
};
type AuthClearAction = { type: 'AUTH_RECIEVE_AUTHENTICATION_CLEAR' };
type AuthExpiredModalShownAction = { type: 'AUTH_EXPIRED_MODAL_SHOWN' };

export type Action =
    | AuthReceiveAction
    | AuthClearAction
    | AuthExpiredModalShownAction;

export const recieveAuthentication = (
    userInfo: UserInfo,
    idToken: string,
    accessToken: string
): AuthReceiveAction => ({
    type: 'AUTH_RECIEVE_AUTHENTICATION',
    payload: { userInfo, idToken, accessToken }
});

export const clearAuthentication = (): AuthClearAction => ({
    type: 'AUTH_RECIEVE_AUTHENTICATION_CLEAR'
});

export const expiredModalShown = (): AuthExpiredModalShownAction => ({
    type: 'AUTH_EXPIRED_MODAL_SHOWN'
});

export const AUTH_RECIEVE_AUTHENTICATION = 'AUTH_RECIEVE_AUTHENTICATION';
export const AUTH_RECIEVE_AUTHENTICATION_CLEAR = 'AUTH_RECIEVE_AUTHENTICATION_CLEAR';

export const recieveAuthentication = (userInfo, idToken, accessToken) => ({
    type: AUTH_RECIEVE_AUTHENTICATION,
    payload: { userInfo, idToken, accessToken }
})

export const clearAuthentication = () => ({
    type: AUTH_RECIEVE_AUTHENTICATION_CLEAR
})
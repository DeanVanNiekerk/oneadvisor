type ReceiveTokenAction = {
    type: "AUTH_TOKEN_RECEIVE";
    payload: string | null;
};

export type TokenActions = ReceiveTokenAction;

export const recieveToken = (token: string | null): TokenActions => ({
    type: "AUTH_TOKEN_RECEIVE",
    payload: token,
});

export const signOut = (): TokenActions => {
    return recieveToken(null);
};

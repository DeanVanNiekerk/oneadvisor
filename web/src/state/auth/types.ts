export type UserInfo = {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    email: string;
};

export type AccessTokenData = {
    aud: string;
    branchid: string;
    cid: string;
    exp: number;
    iat: number;
    iss: string;
    jti: string;
    scopelevel: string;
    scp: string[];
    sub: string;
    uid: string;
    ver: number;
};

export type IdTokenData = {
    amr: string[];
    at_hash: string;
    aud: string;
    auth_time: number;
    branchid: string;
    email: string;
    exp: number;
    iat: number;
    idp: string;
    iss: string;
    jti: string;
    name: string;
    nonce: string;
    organisation: string;
    preferred_username: string;
    roles: string[];
    scopelevel: string;
    sub: string;
    ver: number;
};

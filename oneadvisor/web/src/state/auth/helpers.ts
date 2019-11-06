import jwt_decode from "jwt-decode";

import { TokenData } from "./types";

export const decodeToken = (token: string | null): TokenData | null => {
    if (token === null) return null;
    try {
        return jwt_decode(token);
    } catch (err) {
        console.error(err);
        return null;
    }
};

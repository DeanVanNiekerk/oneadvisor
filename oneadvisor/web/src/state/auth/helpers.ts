import jwtDecode from "jwt-decode";

import { TokenData } from "./types";

export const decodeToken = (token: string | null): TokenData | null => {
    if (token === null) return null;
    try {
        return jwtDecode(token);
    } catch (err) {
        console.error(err);
        return null;
    }
};

import { Identity } from './auth';

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const setToken = (token: string | null) => {
    if (token !== null) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
};

export const getIdentity = (): Identity | null => {
    const identity = localStorage.getItem('identity');
    if (!identity) return null;

    return JSON.parse(identity);
};

export const setIdentity = (identity: Identity | null) => {
    if (identity !== null)
        localStorage.setItem('identity', JSON.stringify(identity));
    else localStorage.removeItem('identity');
};

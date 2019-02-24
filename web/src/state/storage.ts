import { Identity } from './auth';

export const getToken = () => {
    return localStorage.getItem('token');
};

export const setToken = token => {
    localStorage.setItem('token', token);
};

export const getIdentity = (): Identity => {
    return JSON.parse(localStorage.getItem('identity') || '{}');
};

export const setIdentity = (identity: Identity) => {
    localStorage.setItem('identity', JSON.stringify(identity));
};

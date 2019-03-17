import config from '@/config/config';

const accountBaseApi = `${config.baseApi}/api/account`;

export const signInApi = `${accountBaseApi}/signin`;
export const resetPasswordApi = `${accountBaseApi}/resetPassword`;

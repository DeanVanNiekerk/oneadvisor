import config from '@/config/config';

const accountBaseApi = `${config.baseApi}/api/account`;

export const signInApi = `${accountBaseApi}/signin`;
export const activateApi = `${accountBaseApi}/activate`;
export const resetPasswordApi = `${accountBaseApi}/resetPassword`;
export const resetPasswordRequestApi = `${accountBaseApi}/resetPasswordRequest`;

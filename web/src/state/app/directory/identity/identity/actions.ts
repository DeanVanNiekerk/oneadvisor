import { ApiAction } from '@/app/types';
import { identityApi } from '@/config/api/directory';

import { Identity } from '../types';

type IdentityReceiveAction = {
    type: 'IDENTITY_RECEIVE';
    payload: Identity;
};
type IdentityFetchingAction = { type: 'IDENTITY_FETCHING' };
type IdentityFetchingErrorAction = {
    type: 'IDENTITY_FETCHING_ERROR';
};

export type IdentityAction =
    | IdentityReceiveAction
    | IdentityFetchingAction
    | IdentityFetchingErrorAction;

export const fetchIdentity = (): ApiAction => ({
    type: 'API',
    endpoint: `${identityApi}`,
    dispatchPrefix: 'IDENTITY'
});

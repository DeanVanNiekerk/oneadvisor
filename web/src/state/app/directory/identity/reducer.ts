import { combineReducers } from 'redux';

import { IdentityAction } from './identity/actions';
import { reducer as identityReducer, State as IdentityState } from './identity/reducer';

export type Action = IdentityAction;

export type State = {
    identity: IdentityState;
};

export const reducer = combineReducers({
    identity: identityReducer
});

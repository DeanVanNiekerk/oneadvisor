import { combineReducers } from 'redux';

import { Action as CommissionsAction, reducer as commissions, State as CommissionsState } from './commissions/reducer';

export type Action = CommissionsAction;

export type State = {
    commissions: CommissionsState;
};

export const reducer = combineReducers({
    commissions: commissions
});

import { combineReducers } from 'redux';

import { Action as MembersAction, reducer as members, State as MembersState } from './members/reducer';

export type Action = MembersAction;

export type State = {
    members: MembersState;
};

export const reducer = combineReducers({
    members: members
});

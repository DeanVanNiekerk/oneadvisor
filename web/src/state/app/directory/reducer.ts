import { combineReducers } from 'redux';

import {
    Action as OrganisationsAction, reducer as organisations,
    State as OrganisationsState
} from './organisations/reducer';
import {
    Action as UsersAction, reducer as users, State as UsersState
} from './users/reducer';



export type Action = UsersAction | OrganisationsAction;

export type State = {
    users: UsersState,
    organisations: OrganisationsState
};

export const reducer = combineReducers({
    users: users,
    organisations: organisations
});

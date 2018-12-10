import { combineReducers } from 'redux';

import { Action as ListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { Action as OrganisationAction } from './organisation/actions';
import {
    reducer as organisationReducer, State as OrganisationState
} from './organisation/reducer';



export type Action = ListAction | OrganisationAction;

export type State = {
    list: ListState,
    organisation: OrganisationState
};

export const reducer = combineReducers({
    list: listReducer,
    organisation: organisationReducer
});

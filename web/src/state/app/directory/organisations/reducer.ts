

import { combineReducers } from 'redux';

import { reducer as listReducer } from './list/reducer';
import { State as ListState } from './list/reducer';
import { Action as ListAction } from './list/actions';

import { reducer as organisationReducer } from './organisation/reducer';
import { State as OrganisationState } from './organisation/reducer';
import { Action as OrganisationAction } from './organisation/actions';

export type Action = ListAction | OrganisationAction;

export type State = {
    list: ListState,
    organisation: OrganisationState
};

export const reducer = combineReducers({
    list: listReducer,
    organisation: organisationReducer
});

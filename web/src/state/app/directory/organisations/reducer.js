// @flow

import { combineReducers } from 'redux';
import type { CombinedReducer } from 'redux';

import { reducer as listReducer } from './list/reducer';
import type { State as ListState } from './list/reducer';
import type { Action as ListAction } from './list/actions';

import { reducer as organisationReducer } from './organisation/reducer';
import type { State as OrganisationState } from './organisation/reducer';
import type { Action as OrganisationAction } from './organisation/actions';

export type Action = ListAction | OrganisationAction;

export type State = {
    list: ListState,
    organisation: OrganisationState
};

export const reducer: CombinedReducer<State, Action> = combineReducers({
    list: listReducer,
    organisation: organisationReducer
});

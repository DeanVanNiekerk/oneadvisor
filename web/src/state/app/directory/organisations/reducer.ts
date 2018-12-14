import { combineReducers } from 'redux';

import { OrganisationListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';
import { OrganisationAction } from './organisation/actions';
import { reducer as organisationReducer, State as OrganisationState } from './organisation/reducer';

export type Action = OrganisationListAction | OrganisationAction;

export type State = {
    list: ListState;
    organisation: OrganisationState;
};

export const reducer = combineReducers({
    list: listReducer,
    organisation: organisationReducer
});

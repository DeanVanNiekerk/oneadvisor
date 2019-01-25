import { combineReducers } from 'redux';

import { ContactAction } from './contact/actions';
import { reducer as contactReducer, State as ContactState } from './contact/reducer';
import { ContactListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = ContactListAction | ContactAction;

export type State = {
    list: ListState;
    contact: ContactState;
};

export const reducer = combineReducers({
    list: listReducer,
    contact: contactReducer
});

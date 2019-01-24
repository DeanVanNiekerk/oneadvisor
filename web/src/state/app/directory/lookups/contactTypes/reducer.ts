import { combineReducers } from 'redux';

import { ContactTypeListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = ContactTypeListAction;

export type State = {
    list: ListState;
};

export const reducer = combineReducers({
    list: listReducer
});

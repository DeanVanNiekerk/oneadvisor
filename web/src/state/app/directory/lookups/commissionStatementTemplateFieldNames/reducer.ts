import { combineReducers } from 'redux';

import { CommissionStatementTemplateFieldNameListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = CommissionStatementTemplateFieldNameListAction;

export type State = {
    list: ListState;
};

export const reducer = combineReducers({
    list: listReducer
});

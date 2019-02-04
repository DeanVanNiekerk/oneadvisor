import { combineReducers } from 'redux';

import { StatementAction } from './statement/actions';
import { reducer as statementReducer, State as StatementState } from './statement/reducer';
import { StatementListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = StatementListAction | StatementAction;

export type State = {
    list: ListState;
    statement: StatementState;
};

export const reducer = combineReducers({
    list: listReducer,
    statement: statementReducer
});

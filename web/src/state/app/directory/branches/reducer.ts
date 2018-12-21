import { combineReducers } from 'redux';

import { BranchAction } from './branch/actions';
import { reducer as branchReducer, State as BranchState } from './branch/reducer';
import { BranchListAction } from './list/actions';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type Action = BranchListAction | BranchAction;

export type State = {
    list: ListState;
    branch: BranchState;
};

export const reducer = combineReducers({
    list: listReducer,
    branch: branchReducer
});

import { combineReducers } from 'redux';

import { reducer as branchReducer, State as BranchState } from './branch/reducer';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type State = {
    list: ListState;
    branch: BranchState;
};

export const reducer = combineReducers({
    list: listReducer,
    branch: branchReducer,
});

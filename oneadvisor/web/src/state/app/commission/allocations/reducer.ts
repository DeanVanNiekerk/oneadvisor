import { combineReducers } from 'redux';

import { reducer as allocationReducer, State as AllocationState } from './allocation/reducer';
import { reducer as listReducer, State as ListState } from './list/reducer';

export type State = {
    list: ListState;
    allocation: AllocationState;
};

export const reducer = combineReducers({
    list: listReducer,
    allocation: allocationReducer,
});

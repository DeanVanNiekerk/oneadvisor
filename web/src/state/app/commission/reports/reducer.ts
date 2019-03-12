import { combineReducers } from 'redux';

import { reducer as memberRevenue, State as MemberRevenueState } from './memberRevenue/reducer';

export type State = {
    memberRevenue: MemberRevenueState;
};

export const reducer = combineReducers({
    memberRevenue: memberRevenue,
});

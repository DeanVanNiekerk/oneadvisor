import { combineReducers } from 'redux';

import { reducer as clientRevenue, State as ClientRevenueState } from './clientRevenue/reducer';
import { reducer as userMonthlyCommission, State as UserMonthlyCommissionState } from './userMonthlyCommission/reducer';

export type State = {
    clientRevenue: ClientRevenueState;
    userMonthlyCommission: UserMonthlyCommissionState;
};

export const reducer = combineReducers({
    clientRevenue: clientRevenue,
    userMonthlyCommission: userMonthlyCommission,
});

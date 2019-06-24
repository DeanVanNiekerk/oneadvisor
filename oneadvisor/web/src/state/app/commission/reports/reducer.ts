import { combineReducers } from 'redux';

import { reducer as clientRevenue, State as ClientRevenueState } from './clientRevenue/reducer';
import {
    reducer as userCompanyMonthlyCommission, State as UserCompanyMonthlyCommissionState
} from './userCompanyMonthlyCommission/reducer';
import {
    reducer as userEarningsTypeMonthlyCommission, State as UserEarningsTypeMonthlyCommissionState
} from './userEarningsTypeMonthlyCommission/reducer';

export type State = {
    clientRevenue: ClientRevenueState;
    userEarningsTypeMonthlyCommission: UserEarningsTypeMonthlyCommissionState;
    userCompanyMonthlyCommission: UserCompanyMonthlyCommissionState;
};

export const reducer = combineReducers({
    clientRevenue: clientRevenue,
    userEarningsTypeMonthlyCommission: userEarningsTypeMonthlyCommission,
    userCompanyMonthlyCommission: userCompanyMonthlyCommission,
});

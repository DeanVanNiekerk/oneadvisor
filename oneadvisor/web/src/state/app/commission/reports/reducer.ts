import { combineReducers } from "redux";

import { reducer as clientRevenue, State as ClientRevenueState } from "./clientRevenue/reducer";
import { reducer as projections, State as ProjectionsState } from "./projections/reducer";
import {
    reducer as userCompanyMonthlyCommission, State as UserCompanyMonthlyCommissionState
} from "./userCompanyMonthlyCommission/reducer";
import {
    reducer as userEarningsTypeMonthlyCommission, State as UserEarningsTypeMonthlyCommissionState
} from "./userEarningsTypeMonthlyCommission/reducer";
import {
    reducer as userMonthlyCommission, State as UsereMonthlyCommissionState
} from "./userMonthlyCommission/reducer";

export type State = {
    clientRevenue: ClientRevenueState;
    userEarningsTypeMonthlyCommission: UserEarningsTypeMonthlyCommissionState;
    userCompanyMonthlyCommission: UserCompanyMonthlyCommissionState;
    userMonthlyCommission: UsereMonthlyCommissionState;
    projections: ProjectionsState;
};

export const reducer = combineReducers({
    clientRevenue: clientRevenue,
    userEarningsTypeMonthlyCommission: userEarningsTypeMonthlyCommission,
    userCompanyMonthlyCommission: userCompanyMonthlyCommission,
    userMonthlyCommission: userMonthlyCommission,
    projections: projections,
});

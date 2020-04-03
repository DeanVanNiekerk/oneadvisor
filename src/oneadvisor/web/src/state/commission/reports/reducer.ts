import { combineReducers } from "redux";

import { reducer as clientRevenue } from "./clientRevenue/reducer";
import { reducer as commissionLapse } from "./commissionLapse/reducer";
import { reducer as projections } from "./projections/reducer";
import { ReportsState } from "./types";
import { reducer as userCompanyMonthlyCommission } from "./userCompanyMonthlyCommission/reducer";
import { reducer as userEarningsTypeMonthlyCommission } from "./userEarningsTypeMonthlyCommission/reducer";
import { reducer as userMonthlyCommission } from "./userMonthlyCommission/reducer";

export const reducer = combineReducers<ReportsState>({
    clientRevenue: clientRevenue,
    userEarningsTypeMonthlyCommission: userEarningsTypeMonthlyCommission,
    userCompanyMonthlyCommission: userCompanyMonthlyCommission,
    userMonthlyCommission: userMonthlyCommission,
    projections: projections,
    commissionLapse: commissionLapse,
});

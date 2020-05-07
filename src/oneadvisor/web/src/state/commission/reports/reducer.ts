import { combineReducers } from "redux";
import { PersistConfig, persistReducer } from "redux-persist";

import { getPersistStorage } from "@/state/storage";

import { reducer as clientRevenue } from "./clientRevenue/reducer";
import { ClientRevenueState } from "./clientRevenue/types";
import { reducer as commissionLapse } from "./commissionLapse/reducer";
import { CommissionLapseState } from "./commissionLapse/types";
import { reducer as projections } from "./projections/reducer";
import { ReportsState } from "./types";
import { reducer as userCompanyMonthlyCommission } from "./userCompanyMonthlyCommission/reducer";
import { reducer as userEarningsTypeMonthlyCommission } from "./userEarningsTypeMonthlyCommission/reducer";
import { reducer as userMonthlyCommission } from "./userMonthlyCommission/reducer";

const clientRevenueConfig: PersistConfig<ClientRevenueState> = {
    key: "commission-reports-client-revenue",
    whitelist: ["pageOptions"],
    storage: getPersistStorage(),
};

const commissionLapseConfig: PersistConfig<CommissionLapseState> = {
    key: "commission-reports-commission-lapse",
    whitelist: ["pageOptions"],
    storage: getPersistStorage(),
};

export const reducer = combineReducers<ReportsState>({
    clientRevenue: persistReducer(clientRevenueConfig, clientRevenue),
    commissionLapse: persistReducer(commissionLapseConfig, commissionLapse),
    userEarningsTypeMonthlyCommission: userEarningsTypeMonthlyCommission,
    userCompanyMonthlyCommission: userCompanyMonthlyCommission,
    userMonthlyCommission: userMonthlyCommission,
    projections: projections,
});

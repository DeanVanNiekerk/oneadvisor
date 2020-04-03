import { combineReducers } from "redux";

import { reducer as allocations } from "./allocations/reducer";
import { reducer as commissions } from "./commissions/reducer";
import { reducer as errors } from "./errors/reducer";
import { reducer as lookups } from "./lookups/reducer";
import { reducer as reports } from "./reports/reducer";
import { reducer as splitRulePolicies } from "./splitRulePolicies/reducer";
import { reducer as splitRules } from "./splitRules/reducer";
import { reducer as statements } from "./statements/reducer";
import { reducer as templates } from "./templates/reducer";
import { CommissionState } from "./types";

export const reducer = combineReducers<CommissionState>({
    commissions: commissions,
    statements: statements,
    errors: errors,
    templates: templates,
    reports: reports,
    lookups: lookups,
    allocations: allocations,
    splitRules: splitRules,
    splitRulePolicies: splitRulePolicies,
});

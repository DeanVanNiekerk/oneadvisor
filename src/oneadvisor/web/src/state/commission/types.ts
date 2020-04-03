import { AllocationsState } from "./allocations";
import { CommissionsState } from "./commissions";
import { ErrorsState } from "./errors";
import { LookupsState } from "./lookups/types";
import { ReportsState } from "./reports/types";
import { SplitRulePoliciesState } from "./splitRulePolicies";
import { SplitRulesState } from "./splitRules";
import { StatementsState } from "./statements";
import { TemplatesState } from "./templates";

export type CommissionState = {
    commissions: CommissionsState;
    statements: StatementsState;
    errors: ErrorsState;
    templates: TemplatesState;
    reports: ReportsState;
    lookups: LookupsState;
    allocations: AllocationsState;
    splitRules: SplitRulesState;
    splitRulePolicies: SplitRulePoliciesState;
};

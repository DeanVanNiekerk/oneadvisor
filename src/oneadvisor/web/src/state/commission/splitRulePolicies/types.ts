import { Filters, PageOptions, SortOptions } from "@/app/table";
import { ValidationResult } from "@/app/validation/types";

export type SplitRulePolicyInfo = {
    policyId: string;
    policyNumber: string;
    policyCompanyId: string;
    policyUserId: string;
    policyClientId: string;
    policyClientFirstName: string;
    policyClientLastName: string;
    defaultCommissionSplitRuleId: string | null;
    defaultCommissionSplitRuleName: string | null;
    commissionSplitRuleId: string | null;
    commissionSplitRuleName: string | null;
};

export type SplitRulePolicy = {
    id: string | null;
    commissionSplitRuleId: string | null;
    policyId: string | null;
};

export type ListState = {
    readonly totalItems: number;
    readonly items: SplitRulePolicyInfo[];
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
    readonly filters: Filters | null;
};

export type SplitRulePolicyState = {
    readonly splitRulePolicy: SplitRulePolicy | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export type SplitRulePoliciesState = {
    readonly list: ListState;
    readonly splitRulePolicy: SplitRulePolicyState;
};

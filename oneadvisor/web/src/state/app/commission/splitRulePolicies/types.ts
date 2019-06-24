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

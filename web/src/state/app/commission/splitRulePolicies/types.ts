export type SplitRulePolicyInfo = {
    policyId: string;
    policyNumber: string;
    policyCompanyId: string;
    policyUserId: string;
    policyClientFirstName: string;
    policyClientLastName: string;
};

export type SplitRulePolicy = {
    id: string | null;
    commissionSplitRuleId: string | null;
    policyId: string | null;
};

import { PolicyEdit } from "../types";

export const createPolicy = (policy: Partial<PolicyEdit> = {}): PolicyEdit => ({
    id: null,
    userId: null,
    number: "",
    companyId: null,
    clientId: null,
    premium: null,
    startDate: null,
    policyTypeId: null,
    policyProductTypeId: null,
    policyProductId: null,
    isActive: true,
    numberAliases: [],
    ...policy,
});

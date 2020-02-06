import { PolicyEdit } from "../";

export const createPolicy = (policy: Partial<PolicyEdit> = {}): PolicyEdit => ({
    id: null,
    userId: "",
    number: "",
    companyId: "",
    clientId: "",
    premium: null,
    startDate: "",
    policyTypeId: null,
    policyProductTypeId: null,
    policyProductId: null,
    isActive: true,
    numberAliases: [],
    ...policy,
});

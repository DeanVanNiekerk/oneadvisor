import { PolicyEdit } from '../';

export const newPolicy = (policy: Partial<PolicyEdit> = {}): PolicyEdit => ({
    id: '',
    userId: '',
    number: '',
    companyId: '',
    clientId: '',
    premium: null,
    startDate: '',
    policyTypeId: null,
    ...policy
});

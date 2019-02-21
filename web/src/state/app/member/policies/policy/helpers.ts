import { PolicyEdit } from '../';

export const newPolicy = (policy: Partial<PolicyEdit> = {}): PolicyEdit => ({
    id: '',
    userId: '',
    number: '',
    companyId: '',
    memberId: '',
    premium: null,
    startDate: '',
    policyTypeId: null,
    ...policy
});

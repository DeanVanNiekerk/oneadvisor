import { PolicyEdit } from '../';

export const newPolicy = (memberId: string): PolicyEdit => ({
    id: '',
    userId: '',
    number: '',
    companyId: '',
    memberId: memberId,
    premium: null,
    startDate: '',
    policyTypeId: null
});

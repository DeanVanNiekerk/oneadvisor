import { PolicyEdit } from '../';

export const newPolicy = (
    memberId: string,
    companyId: string = '',
    number: string = ''
): PolicyEdit => ({
    id: '',
    userId: '',
    number: number,
    companyId: companyId,
    memberId: memberId,
    premium: null,
    startDate: '',
    policyTypeId: null
});

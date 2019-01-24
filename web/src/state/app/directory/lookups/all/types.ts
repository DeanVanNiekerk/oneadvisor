import { CommissionType, Company, ContactType, MarritalStatus, PolicyType } from '../';

export type Lookups = {
    companies: Company[];
    commissionTypes: CommissionType[];
    marritalStatus: MarritalStatus[];
    policyTypes: PolicyType[];
    contactTypes: ContactType[];
};

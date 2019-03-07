import {
    CommissionEarningsType, CommissionStatementTemplateFieldName, CommissionType, Company, ContactType, MarritalStatus,
    PolicyType
} from '../';

export type Lookups = {
    companies: Company[];
    commissionTypes: CommissionType[];
    commissionEarningsTypes: CommissionEarningsType[];
    marritalStatus: MarritalStatus[];
    policyTypes: PolicyType[];
    contactTypes: ContactType[];
    commissionStatementTemplateFieldNames: CommissionStatementTemplateFieldName[];
};

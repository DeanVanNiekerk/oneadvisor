import { CommissionType } from '../commissionTypes';
import { Company } from '../companies';
import { MarritalStatus } from '../marritalStatus';

export type Lookups = {
    companies: Company[];
    commissionTypes: CommissionType[];
    marritalStatus: MarritalStatus[];
};

import { ClientType, ContactType, MarritalStatus, PolicyProductType, PolicyType } from "../";

export type Lookups = {
    marritalStatus: MarritalStatus[];
    policyTypes: PolicyType[];
    policyProductTypes: PolicyProductType[];
    contactTypes: ContactType[];
    clientTypes: ClientType[];
};

export type AllLookupsState = {
    readonly fetching: boolean;
};

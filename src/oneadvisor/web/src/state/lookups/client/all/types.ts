import { ClientType } from "../clientTypes/types";
import { ContactType } from "../contactTypes/types";
import { MarritalStatus } from "../marritalStatus/types";
import { PolicyProductType } from "../policyProductTypes/types";
import { PolicyTypeCharacteristic } from "../policyTypeCharacteristics/types";
import { PolicyType } from "../policyTypes/types";

export type Lookups = {
    marritalStatus: MarritalStatus[];
    policyTypes: PolicyType[];
    policyProductTypes: PolicyProductType[];
    contactTypes: ContactType[];
    clientTypes: ClientType[];
    policyTypeCharacteristics: PolicyTypeCharacteristic[];
};

export type AllLookupsState = {
    readonly fetching: boolean;
};

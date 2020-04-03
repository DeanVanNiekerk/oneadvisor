import { ClientsState } from "./clients";
import { ContactsState } from "./contacts";
import { ImportState } from "./import";
import { LookupsState } from "./lookups";
import { PoliciesState } from "./policies";

export type ClientState = {
    readonly clients: ClientsState;
    readonly import: ImportState;
    readonly policies: PoliciesState;
    readonly contacts: ContactsState;
    readonly lookups: LookupsState;
};

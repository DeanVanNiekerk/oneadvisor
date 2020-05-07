import { ClientsState } from "./clients/types";
import { ContactsState } from "./contacts";
import { ImportState } from "./import";
import { PoliciesState } from "./policies/types";

export type ClientState = {
    readonly clients: ClientsState;
    readonly import: ImportState;
    readonly policies: PoliciesState;
    readonly contacts: ContactsState;
};

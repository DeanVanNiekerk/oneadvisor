import { LookupsState as ClientLookupsState } from "./client";
import { LookupsState as DirectoryLookupsState } from "./directory";

export type LookupsState = {
    readonly client: ClientLookupsState;
    readonly directory: DirectoryLookupsState;
};

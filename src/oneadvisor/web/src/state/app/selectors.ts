import { createSelector } from "reselect";

import { directoryLookupsSelector } from "../directory/lookups";
import { RootState } from "../rootReducer";
import { clientLookupsSelector } from "./client/lookups";
import { commissionLookupsSelector } from "./commission/lookups";

export const isLoadingLookupsSelector: (state: RootState) => boolean = createSelector(
    directoryLookupsSelector,
    commissionLookupsSelector,
    clientLookupsSelector,
    (directoryLookups, commissionLookups, clientLookups) =>
        directoryLookups.fetching || commissionLookups.fetching || clientLookups.fetching
);

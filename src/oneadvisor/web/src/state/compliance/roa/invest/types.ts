import { RoaInvestDataState } from "./data/types";
import { RoaInvestInputState } from "./inputs/types";
import { RoaInvestLookupsState } from "./lookups/types";
import { RoaInvestRiskState } from "./risk/types";

export type RoaInvestState = {
    readonly inputs: RoaInvestInputState;
    readonly data: RoaInvestDataState;
    readonly lookups: RoaInvestLookupsState;
    readonly risk: RoaInvestRiskState;
};

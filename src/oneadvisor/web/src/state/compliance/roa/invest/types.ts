import { RoaInvestDataState } from "./data/types";
import { RoaInvestInputState } from "./inputs/types";

export type RoaInvestState = {
    readonly inputs: RoaInvestInputState;
    readonly data: RoaInvestDataState;
};

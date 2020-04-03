import { ComplianceState } from "./types";

export const defaultState = {
    fetching: "WORKING!",
};

export const reducer = (state: ComplianceState = defaultState) => {
    return state;
};

import { RoaInvestLookupsState } from "./types";

export const defaultState: RoaInvestLookupsState = {
    investmentAdviceTypes: [
        {
            code: "retirement",
            name: "Retirement",
        },
        {
            code: "education",
            name: "Education",
        },
        {
            code: "reserve",
            name: "Reserve",
        },
        {
            code: "other",
            name: "Other",
        },
    ],
};

export const reducer = (state: RoaInvestLookupsState = defaultState) => {
    return state;
};

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
    rateOfReturns: [
        {
            code: "cpi_1",
            name: "CPI + 1%",
        },
        {
            code: "cpi_2",
            name: "CPI + 2%",
        },
        {
            code: "cpi_3",
            name: "CPI + 3%",
        },
        {
            code: "cpi_4",
            name: "CPI + 4%",
        },
        {
            code: "cpi_5",
            name: "CPI + 5%",
        },
        {
            code: "cpi_6",
            name: "CPI + 6%",
        },
    ],
};

export const reducer = (state: RoaInvestLookupsState = defaultState) => {
    return state;
};

import { RoaInvestDataAction } from "./";
import { RoaInvestDataState } from "./types";

export const defaultState: RoaInvestDataState = {
    fetching: false,
    data: {
        clientFullName: "",
        clientIdNumber: "",
        userFullName: "",
        consultReason: "",
        clientAge: "",
        clientYearsToRetirement: "",
        lifeExpectancy: "",
        rateOfReturn: "",
        retirementAge: "",
        investmentAdviceType: "",
        needMonthly: "",
        needLumpsum: "",
        contributionMonthly: "",
        contributionLumpsum: "",

        discussedProductTypes: [],
        discussedCompanies: [],
        discussedFunds: [],

        recommendedProductTypes: [],
        recommendedCompanies: [],
        recommendedFunds: [],
        recommendedAction: "",

        clientChoice: "",

        investments: [],

        riskProfileCode: "moderate",
        riskScore: null,
    },
};

export const reducer = (state: RoaInvestDataState = defaultState, action: RoaInvestDataAction) => {
    switch (action.type) {
        case "COMPLIANCE_ROA_INVEST_DATA_FETCHING_RECEIVE": {
            return {
                ...state,
                fetching: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_DATA_RECEIVE": {
            return {
                ...state,
                data: action.payload,
            };
        }
        default:
            return state;
    }
};

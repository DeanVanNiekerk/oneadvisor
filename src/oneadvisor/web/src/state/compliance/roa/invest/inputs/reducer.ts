import { RoaInvestInputAction } from "./";
import { RoaInvestInputState } from "./types";

export const defaultState: RoaInvestInputState = {
    clientId: "ba053117-cef7-43d7-2200-08d7e6ed7443",
    consultReason:
        "Client was concerned about his returement investments and wanted to discuss the current retirement reforms that have been suggested by government. Prescribed assets!! Would like to get as much out of SA as possible.",
    productTypeIds: [],
    companyIds: [],
    funds: [],
    advisorRecommendation: `I have recommended Allan Gray for the offshore investment. They have the lowest entry level premium to open an investment. Even though R250,000 is not enough to enter the likes of Om and Sanlam - I still prefer Allan Gray's structure and costing. Unit Trust platform is the best for your tax rate. I have recomended the funds according to your profile

The 2/3rds of the RA maturity will have to go into a annuity. i have recomended a living annuity as it aligns more with your goals of getting money out. Since your current income is exempt from tax (Offshore earnings less than R1m), I have set your LA drawdown to the maximum R79,000pa tax rebate allowance. Once this pays out it will be transfered and added to your offshore portfolio.

Although the action below is required, this exercise is pureley focused on restructure. In future Paul will look at adding to his savings.`,
    investmentLumpsum: null,
    investmentRecurringPremium: null,
    retirementPolicyRecurringPremium: null,
};

export const reducer = (
    state: RoaInvestInputState = defaultState,
    action: RoaInvestInputAction
) => {
    switch (action.type) {
        case "COMPLIANCE_ROA_INVEST_INPUT_CLIENTID_RECEIVE": {
            return {
                ...state,
                clientId: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_CONSULT_REASON_RECEIVE": {
            return {
                ...state,
                consultReason: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_PRODUCTTYPEIDS_RECEIVE": {
            return {
                ...state,
                productTypeIds: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_COMPANYIDS_RECEIVE": {
            return {
                ...state,
                companyIds: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_FUNDS_RECEIVE": {
            return {
                ...state,
                funds: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_ADVISOR_RECOMMENDATION_RECEIVE": {
            return {
                ...state,
                advisorRecommendation: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_INVEST_REC_PREMIUM_RECEIVE": {
            return {
                ...state,
                investmentRecurringPremium: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_INVEST_LUMPSUM_RECEIVE": {
            return {
                ...state,
                investmentLumpsum: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_RET_REC_PREMIUM_RECEIVE": {
            return {
                ...state,
                retirementPolicyRecurringPremium: action.payload,
            };
        }
        default:
            return state;
    }
};

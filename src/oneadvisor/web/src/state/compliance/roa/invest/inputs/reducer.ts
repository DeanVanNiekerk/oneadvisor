import { v4 } from "uuid";

import { RoaInvestInputAction } from "./";
import { Investment, RoaInvestInputState } from "./types";

export const defaultState: RoaInvestInputState = {
    clientId: "",
    consultReason: "",
    investmentAdviceTypeCode: "",
    needMonthly: null,
    needLumpsum: null,
    contributionMonthly: null,
    contributionLumpsum: null,
    discussedProductTypeIds: [],
    discussedCompanyIds: [],
    discussedFunds: [],
    recommendedProductTypeIds: [],
    recommendedCompanyIds: [],
    recommendedFunds: [],
    recommendedAction: "",
    clientChoice: "",
    investments: [],
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
        case "COMPLIANCE_ROA_INVEST_INPUT_INVESTMENTADVICETYPECODE_RECEIVE": {
            return {
                ...state,
                investmentAdviceTypeCode: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_NEEDMONTHLY_RECEIVE": {
            return {
                ...state,
                needMonthly: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_NEEDLUMPSUM_RECEIVE": {
            return {
                ...state,
                needLumpsum: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_CONTRIBUTIONMONTHLY_RECEIVE": {
            return {
                ...state,
                contributionMonthly: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_CONTRIBUTIONLUMPSUM_RECEIVE": {
            return {
                ...state,
                contributionLumpsum: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDPRODUCTTYPEIDS_RECEIVE": {
            return {
                ...state,
                discussedProductTypeIds: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDCOMPANYIDS_RECEIVE": {
            return {
                ...state,
                discussedCompanyIds: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDFUNDS_RECEIVE": {
            return {
                ...state,
                discussedFunds: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDPRODUCTTYPEIDS_RECEIVE": {
            return {
                ...state,
                recommendedProductTypeIds: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDCOMPANYIDS_RECEIVE": {
            return {
                ...state,
                recommendedCompanyIds: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDFUNDS_RECEIVE": {
            return {
                ...state,
                recommendedFunds: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDACTION_RECEIVE": {
            return {
                ...state,
                recommendedAction: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_CLIENTCHOICE_RECEIVE": {
            return {
                ...state,
                clientChoice: action.payload,
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_INVESTMENT_RECEIVE": {
            return {
                ...state,
                investments: state.investments.map((investment) => {
                    if (investment.id === action.payload.id) return action.payload;
                    return investment;
                }),
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_INVESTMENT_ADD": {
            const investment: Investment = {
                id: v4(),
                companyId: "",
                productTypeId: "",
                funds: [],
                contributionPremium: null,
                contributionLumpsum: null,
                upfrontFeeAmount: null,
                upfrontFeePercent: null,
                assetManagementFeePercent: null,
            };
            return {
                ...state,
                investments: [...state.investments, investment],
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_INVESTMENT_REMOVE": {
            return {
                ...state,
                investments: state.investments.filter((investment) => {
                    return investment.id !== action.payload;
                }),
            };
        }
        case "COMPLIANCE_ROA_INVEST_INPUT_STATE_RECEIVE": {
            return {
                ...action.payload,
            };
        }
        default:
            return state;
    }
};

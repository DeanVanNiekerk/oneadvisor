import { RoaInvestInputAction } from "./";
import { RoaInvestInputState } from "./types";

export const defaultState: RoaInvestInputState = {
    clientId: "ba053117-cef7-43d7-2200-08d7e6ed7443",
    consultReason:
        "Client was concerned about his returement investments and wanted to discuss the current retirement reforms that have been suggested by government. Prescribed assets!! Would like to get as much out of SA as possible.",
    productTypeIds: [],
    companyIds: [],
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
        default:
            return state;
    }
};

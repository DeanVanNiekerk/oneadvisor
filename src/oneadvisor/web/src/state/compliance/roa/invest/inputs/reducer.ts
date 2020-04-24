import { RoaInvestInputAction, RoaInvestInputState } from "./";

export const defaultState: RoaInvestInputState = {
    clientId: null,
    consultReason: "",
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
        default:
            return state;
    }
};

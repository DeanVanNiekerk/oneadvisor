import { PolicyTypeCharacteristicState } from "../types";
import { PolicyTypeCharacteristicAction } from "./actions";

export const defaultState: PolicyTypeCharacteristicState = {
    policyTypeCharacteristic: null,
    updating: false,
    validationResults: [],
};

export const reducer = (
    state: PolicyTypeCharacteristicState = defaultState,
    action: PolicyTypeCharacteristicAction
): PolicyTypeCharacteristicState => {
    switch (action.type) {
        case "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_RECEIVE": {
            return {
                ...state,
                policyTypeCharacteristic: action.payload,
                validationResults: [],
            };
        }
        case "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_FETCHING": {
            return {
                ...state,
                updating: true,
                validationResults: [],
            };
        }
        case "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_RECEIVE": {
            return {
                ...state,
                updating: false,
            };
        }
        case "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_FETCHING_ERROR": {
            return {
                ...state,
                updating: false,
            };
        }
        case "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_EDIT_VALIDATION_ERROR": {
            return {
                ...state,
                updating: false,
                validationResults: action.payload,
            };
        }
        default:
            return state;
    }
};

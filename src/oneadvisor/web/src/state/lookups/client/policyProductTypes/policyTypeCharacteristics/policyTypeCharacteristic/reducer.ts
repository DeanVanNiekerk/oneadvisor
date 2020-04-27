import { PolicyTypeCharacteristicState } from "../types";
import { PolicyTypeCharacteristicAction } from "./actions";

export const defaultState: PolicyTypeCharacteristicState = {
    policyTypeCharacteristic: null,
    policyTypeCharacteristicOriginal: null,
    updating: false,
    validationResults: [],
    visible: false,
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
                policyTypeCharacteristicOriginal: action.payload,
                validationResults: [],
            };
        }
        case "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_MODIFIED": {
            return {
                ...state,
                policyTypeCharacteristic: action.payload,
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
        case "POLICYTYPECHARACTERISTICS_POLICYTYPECHARACTERISTIC_VISIBLE": {
            return {
                ...state,
                visible: action.payload,
            };
        }
        default:
            return state;
    }
};

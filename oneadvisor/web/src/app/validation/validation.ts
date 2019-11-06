import { isArray } from "util";

import { ValidationResult } from "./types";

export const getValidationError = (
    fieldName: string,
    validationResults: ValidationResult[]
): ValidationResult | null => {
    if (!fieldName) return null;
    const validationResult = validationResults.find(r => r.propertyName.toLowerCase() === fieldName.toLowerCase());
    if (!validationResult) return null;
    return validationResult;
};

export const removeValidationError = (fieldName: string, validationResults: ValidationResult[]): ValidationResult[] => {
    if (!fieldName) return validationResults;
    const index = validationResults.findIndex(r => r.propertyName.toLowerCase() === fieldName.toLowerCase());
    if (index === -1) return validationResults;
    const results = [...validationResults];
    results.splice(index, 1);
    return results;
};

export const formatValue = (value: any): string => {
    if (value === undefined || value === null) return "";
    return value.toString().toLowerCase();
};

export const parseValidationErrors = (errors: string): ValidationResult[] => {
    let validationResults = [];
    try {
        validationResults = JSON.parse(errors);
    } catch (e) {
        return validationResults;
    }

    if (isArray(validationResults)) return validationResults;

    return [];
};

export const getValidationSubSet = (
    prefix: string,
    validationResults: ValidationResult[],
    isArray: boolean = false,
    exactMatch: boolean = false
): ValidationResult[] => {
    if (!prefix) return validationResults;
    const results = validationResults.filter(r => {
        if (exactMatch) return r.propertyName.toLowerCase() === prefix.toLowerCase();
        else return r.propertyName.toLowerCase().indexOf(prefix.toLowerCase()) === 0;
    });
    return results.map(r => {
        return {
            ...r,
            propertyName: r.propertyName.substr(prefix.length + (isArray ? 0 : 1)),
        };
    });
};

export const getErrorMessage = (
    fieldName: string,
    value: string,
    index: number,
    validationResults: ValidationResult[] | undefined
) => {
    const result = getValidationError(`${fieldName}[${index}]` || "", validationResults || []);

    //There is no validation error
    if (!result) return null;

    //If the value has changed then dont show message
    if (formatValue(result.attemptedValue) !== formatValue(value)) return null;

    return result.errorMessage;
};

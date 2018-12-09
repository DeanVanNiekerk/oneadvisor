
import { ValidationResult } from './types';

export const getValidationError = (
    fieldName: string,
    validationResults: ValidationResult[]
): ValidationResult | null => {
    if (!fieldName) return null;
    const validationResult = validationResults.find(
        r => r.propertyName.toLowerCase() === fieldName.toLowerCase()
    );
    if (!validationResult) return null;
    return validationResult;
};

export const removeValidationError = (
    fieldName: string,
    validationResults: ValidationResult[]
): ValidationResult[] => {
    if (!fieldName) return validationResults;
    const index = validationResults.findIndex(
        r => r.propertyName.toLowerCase() === fieldName.toLowerCase()
    );
    if (index === -1) return validationResults;
    const results = [...validationResults];
    results.splice(index, 1);
    return results;
};

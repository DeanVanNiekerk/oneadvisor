// @flow
import type { ValidationResult } from './types';

export const getValidationError = (
    fieldName: string,
    validationResults: ValidationResult[]
): string | null => {
    if (!fieldName) return null;
    const validationResult = validationResults.find(
        r => r.propertyName.toLowerCase() === fieldName.toLowerCase()
    );
    if (!validationResult) return null;
    return validationResult.errorMessage;
};

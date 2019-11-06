import { ValidationResult } from "@/app/validation";

export const getValidationResult = (): ValidationResult => ({
    propertyName: "string",
    errorMessage: "string",
    severity: 1,
    errorCode: "string",
    attemptedValue: "string",
});

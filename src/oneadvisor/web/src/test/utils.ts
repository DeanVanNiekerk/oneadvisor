import { ValidationResult } from "@/app/validation/types";

export const getValidationResult = (): ValidationResult => ({
    propertyName: "string",
    errorMessage: "string",
    severity: 1,
    errorCode: "string",
    attemptedValue: "string",
});

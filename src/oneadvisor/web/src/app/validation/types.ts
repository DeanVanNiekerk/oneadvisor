export type ValidationResult = {
    propertyName: string;
    errorMessage: string;
    severity: number;
    errorCode: string;
    attemptedValue: string | number | boolean | null;
};

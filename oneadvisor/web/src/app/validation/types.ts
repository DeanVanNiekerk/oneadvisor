export type ValidationResult = {
    propertyName: string;
    errorMessage: string;
    severity: number;
    errorCode: string;
    attemptedValue: any;
};

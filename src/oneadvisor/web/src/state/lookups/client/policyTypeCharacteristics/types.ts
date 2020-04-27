import { ValidationResult } from "@/app/validation";

export type PolicyTypeCharacteristic = {
    id: string;
    policyTypeId: string;
    name: string;
    code: string;
};

export type PolicyTypeCharacteristicEdit = {
    id: string | null;
    policyTypeId: string;
    name: string;
    code: string;
};

export type PolicyTypeCharacteristicListState = {
    readonly items: PolicyTypeCharacteristic[];
    readonly fetching: boolean;
};

export type PolicyTypeCharacteristicState = {
    readonly policyTypeCharacteristic: PolicyTypeCharacteristicEdit | null;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export type PolicyTypeCharacteristicsState = {
    readonly list: PolicyTypeCharacteristicListState;
    readonly policyTypeCharacteristic: PolicyTypeCharacteristicState;
};

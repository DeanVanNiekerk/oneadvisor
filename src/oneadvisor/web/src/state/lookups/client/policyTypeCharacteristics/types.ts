import { ValidationResult } from "@/app/validation/types";

export type PolicyTypeCharacteristic = {
    id: string;
    policyTypeId: string;
    name: string;
    displayOrder: number;
};

export type PolicyTypeCharacteristicEdit = {
    id: string | null;
    policyTypeId: string | null;
    name: string;
    displayOrder: number;
};

export type PolicyTypeCharacteristicListState = {
    readonly items: PolicyTypeCharacteristic[];
    readonly fetching: boolean;
};

export type PolicyTypeCharacteristicState = {
    readonly policyTypeCharacteristic: PolicyTypeCharacteristicEdit | null;
    readonly policyTypeCharacteristicOriginal: PolicyTypeCharacteristicEdit | null;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type PolicyTypeCharacteristicsState = {
    readonly list: PolicyTypeCharacteristicListState;
    readonly policyTypeCharacteristic: PolicyTypeCharacteristicState;
};

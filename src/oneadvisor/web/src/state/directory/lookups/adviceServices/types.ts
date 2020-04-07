import { ValidationResult } from "@/app/validation";

export type AdviceService = {
    id: string;
    name: string;
    displayOrder: number;
};

export type AdviceServiceEdit = {
    id: string | null;
    name: string;
    displayOrder: number;
};

export type AdviceServiceState = {
    readonly adviceService: AdviceServiceEdit | null;
    readonly adviceServiceOriginal: AdviceServiceEdit | null;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type AdviceServiceListState = {
    readonly items: AdviceService[];
    readonly fetching: boolean;
};

export type AdviceServicesState = {
    readonly list: AdviceServiceListState;
    readonly adviceService: AdviceServiceState;
};

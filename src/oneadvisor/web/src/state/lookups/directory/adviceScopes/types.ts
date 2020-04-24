import { ValidationResult } from "@/app/validation";

export type AdviceScope = {
    id: string;
    name: string;
};

export type AdviceScopeEdit = {
    id: string | null;
    name: string;
};

export type AdviceScopeState = {
    readonly adviceScope: AdviceScopeEdit | null;
    readonly adviceScopeOriginal: AdviceScopeEdit | null;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type AdviceScopeListState = {
    readonly items: AdviceScope[];
    readonly fetching: boolean;
};

export type AdviceScopesState = {
    readonly list: AdviceScopeListState;
    readonly adviceScope: AdviceScopeState;
};

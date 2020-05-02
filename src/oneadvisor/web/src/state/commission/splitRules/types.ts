import { PageOptions } from "@/app/table";
import { ValidationResult } from "@/app/validation/types";

export type SplitRule = {
    id: string;
    userId: string;
    name: string;
    isDefault: boolean;
    split: Split[];
};

export type SplitRuleEdit = {
    id: string | null;
    userId: string;
    name: string;
    isDefault: boolean;
    split: Split[];
};

export type Split = {
    userId: string;
    percentage: number;
};

export type ListState = {
    readonly totalItems: number;
    readonly items: SplitRule[];
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
};

export type SplitRuleState = {
    readonly splitRule: SplitRuleEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export type SplitRulesState = {
    readonly list: ListState;
    readonly splitRule: SplitRuleState;
};

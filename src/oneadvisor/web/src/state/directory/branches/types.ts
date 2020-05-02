import { Filters } from "@/app/table";
import { ValidationResult } from "@/app/validation/types";

export type Branch = {
    id: string;
    organisationId: string;
    name: string;
};

export type BranchEdit = {
    id: string | null;
    organisationId: string;
    name: string;
};

export type BranchFilters = Filters<Pick<Branch, "organisationId">>;

export type BranchState = {
    readonly branch: BranchEdit | null;
    readonly branchOriginal: BranchEdit | null;
    readonly fetching: boolean;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
    readonly visible: boolean;
};

export type ListState = {
    readonly items: Branch[];
    readonly fetching: boolean;
};

export type BranchesState = {
    readonly list: ListState;
    readonly branch: BranchState;
};

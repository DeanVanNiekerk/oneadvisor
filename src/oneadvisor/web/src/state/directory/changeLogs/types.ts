import { PageOptions, SortOptions } from "@/app/table";
import { ValidationResult } from "@/app/validation";

export type ChangeLog = {
    id: string;
    versionNumber: string;
    releaseDate: string;
    published: boolean;
    log: string;
};

export type ChangeLogEdit = {
    id: string | null;
    versionNumber: string;
    releaseDate: string;
    published: boolean;
    log: string;
};

export type ChangeLogState = {
    readonly changeLog: ChangeLogEdit | null;
    readonly updating: boolean;
    readonly validationResults: ValidationResult[];
};

export type ListState = {
    readonly totalItems: number;
    readonly items: ChangeLog[];
    readonly fetching: boolean;
    readonly pageOptions: PageOptions;
    readonly sortOptions: SortOptions;
};

export type ChangeLogsState = {
    readonly list: ListState;
    readonly changeLog: ChangeLogState;
};

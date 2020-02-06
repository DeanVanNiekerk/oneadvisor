import { Filters } from "@/app/table";

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

import { ApplicationsState } from "./applications";
import { AuditState } from "./audit";
import { BranchesState } from "./branches";
import { BranchesSimpleState } from "./branchesSimple";
import { ChangeLogsState } from "./changeLogs";
import { LookupsState } from "./lookups";
import { OrganisationsState } from "./organisations";
import { RolesState } from "./roles";
import { UseCasesState } from "./usecases";
import { UsersState } from "./users";
import { UsersSimpleState } from "./usersSimple";

export type DirectoryState = {
    readonly users: UsersState;
    readonly usersSimple: UsersSimpleState;
    readonly organisations: OrganisationsState;
    readonly roles: RolesState;
    readonly applications: ApplicationsState;
    readonly useCases: UseCasesState;
    readonly branches: BranchesState;
    readonly branchesSimple: BranchesSimpleState;
    readonly lookups: LookupsState;
    readonly audit: AuditState;
    readonly changeLogs: ChangeLogsState;
};

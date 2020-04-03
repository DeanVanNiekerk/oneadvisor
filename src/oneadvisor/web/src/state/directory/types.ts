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
    users: UsersState;
    usersSimple: UsersSimpleState;
    organisations: OrganisationsState;
    roles: RolesState;
    applications: ApplicationsState;
    useCases: UseCasesState;
    branches: BranchesState;
    branchesSimple: BranchesSimpleState;
    lookups: LookupsState;
    audit: AuditState;
    changeLogs: ChangeLogsState;
};

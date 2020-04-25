import { AuditState } from "./audit";
import { BranchesState } from "./branches";
import { ChangeLogsState } from "./changeLogs";
import { OrganisationsState } from "./organisations";
import { RolesState } from "./roles";
import { UseCasesState } from "./usecases";
import { UsersState } from "./users";

export type DirectoryState = {
    readonly users: UsersState;
    readonly organisations: OrganisationsState;
    readonly roles: RolesState;
    readonly useCases: UseCasesState;
    readonly branches: BranchesState;
    readonly audit: AuditState;
    readonly changeLogs: ChangeLogsState;
};

import { AuditState } from "./audit/types";
import { BranchesState } from "./branches/types";
import { ChangeLogsState } from "./changeLogs/types";
import { OrganisationsState } from "./organisations/types";
import { RolesState } from "./roles/types";
import { UseCasesState } from "./usecases/types";
import { UsersState } from "./users/types";

export type DirectoryState = {
    readonly users: UsersState;
    readonly organisations: OrganisationsState;
    readonly roles: RolesState;
    readonly useCases: UseCasesState;
    readonly branches: BranchesState;
    readonly audit: AuditState;
    readonly changeLogs: ChangeLogsState;
};

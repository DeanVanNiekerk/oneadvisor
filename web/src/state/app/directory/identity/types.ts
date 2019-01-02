export type Identity = {
    id: string;
    name: string;
    organisationId: string;
    organisationName: string;
    branchId: string;
    branchName: string;
    roleIds: string[];
    useCaseIds: string[];
    assistantToUserId: string;
    scope: string;
};

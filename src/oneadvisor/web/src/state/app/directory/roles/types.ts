export type Role = {
    id: string;
    name: string;
    description: string;
    applicationId: string;
};

export type RoleEdit = {
    id: string | null;
    name: string;
    description: string;
    applicationId: string;
    useCaseIds: string[];
};

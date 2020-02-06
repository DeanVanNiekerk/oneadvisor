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

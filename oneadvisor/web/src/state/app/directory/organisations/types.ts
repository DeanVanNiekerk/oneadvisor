export type Organisation = {
    id: string;
    name: string;
};

export type OrganisationEdit = {
    id: string;
    name: string;
    config: Config;
};

export type Config = {
    companyIds: string[];
};

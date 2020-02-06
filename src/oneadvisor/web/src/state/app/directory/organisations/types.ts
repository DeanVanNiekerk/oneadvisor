export type Organisation = {
    id: string;
    name: string;
    vatRegistered: boolean;
    vatRegistrationDate: string | null;
};

export type OrganisationEdit = {
    id: string | null;
    name: string;
    vatRegistered: boolean;
    vatRegistrationDate: string | null;
    config: Config;
};

export type Config = {
    companyIds: string[];
};

import { Config } from "./types";

export const getConfig = (partial: Partial<Config> = {}): Config => {
    const config: Config = {
        companyIds: [],
        licenseCategoryIds: [],
        vatRegistered: false,
        vatRegistrationDate: null,
        address: {
            line1: "",
            line2: null,
            suburb: "",
            postalCode: "",
        },
        complianceOfficer: {
            name: null,
            postalAddress: null,
            telephoneNumber: null,
        },
        branding: {
            logoStorageName: null,
        },
        hasProfessionalIndemnityCover: false,
        hasReceivedCommissionFromCompanies: false,
        hasReceivedCommissionFromCompaniesTarget: null,
        hasSharesInProductProviders: false,
        hasSharesInProductProvidersTarget: null,
        telephoneNumber: null,
        funds: [],
        ...partial,
    };

    return config;
};

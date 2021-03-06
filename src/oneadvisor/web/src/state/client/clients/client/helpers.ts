import { ClientTypeId } from "@/state/lookups/client";

import { ClientEdit } from "../types";

export const createClient = (client: Partial<ClientEdit> = {}): ClientEdit => ({
    id: null,
    clientTypeId: ClientTypeId.Individual,
    firstName: "",
    lastName: "",
    maidenName: "",
    idNumber: "",
    alternateIdNumber: "",
    initials: "",
    preferredName: "",
    dateOfBirth: null,
    marriageDate: null,
    marritalStatusId: null,
    taxNumber: "",
    ...client,
});

export const getAlternateIdNumberLabel = (clientTypeId: ClientTypeId): string => {
    switch (clientTypeId) {
        case ClientTypeId.Company:
        case ClientTypeId.Trust:
        case ClientTypeId.UnknownEntity:
            return "Registration Number";
        default:
            return "Passport Number";
    }
};

export const getDateOfBirthLabel = (clientTypeId: ClientTypeId): string => {
    switch (clientTypeId) {
        case ClientTypeId.Company:
        case ClientTypeId.Trust:
        case ClientTypeId.UnknownEntity:
            return "Registration Date";
        default:
            return "Date of Birth";
    }
};

export const getLastNameLabel = (clientTypeId: ClientTypeId): string => {
    switch (clientTypeId) {
        case ClientTypeId.Company:
        case ClientTypeId.Trust:
        case ClientTypeId.UnknownEntity:
            return "Name";
        default:
            return "Last Name";
    }
};

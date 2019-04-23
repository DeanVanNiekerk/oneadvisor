import { ClientEdit } from '../';
import { ClientTypeId } from '../../lookups';

export const newClient = (client: Partial<ClientEdit> = {}): ClientEdit => ({
    id: "",
    clientTypeId: ClientTypeId.Individual,
    firstName: "",
    lastName: "",
    maidenName: "",
    idNumber: "",
    alternateIdNumber: "",
    initials: "",
    preferredName: "",
    dateOfBirth: "",
    marriageDate: "",
    marritalStatusId: "",
    taxNumber: "",
    ...client,
});

export const getAlternateIdNumberLabel = (
    clientTypeId: ClientTypeId
): string => {
    switch (clientTypeId) {
        case ClientTypeId.Company:
        case ClientTypeId.Trust:
        case ClientTypeId.BusinessEntity:
            return "Registration Number";
        default:
            return "Passport Number";
    }
};

export const getDateOfBirthLabel = (clientTypeId: ClientTypeId): string => {
    switch (clientTypeId) {
        case ClientTypeId.Company:
        case ClientTypeId.Trust:
        case ClientTypeId.BusinessEntity:
            return "Registration Date";
        default:
            return "Date of Birth";
    }
};

export const getLastNameLabel = (clientTypeId: ClientTypeId): string => {
    switch (clientTypeId) {
        case ClientTypeId.Company:
        case ClientTypeId.Trust:
        case ClientTypeId.BusinessEntity:
            return "Name";
        default:
            return "Last Name";
    }
};

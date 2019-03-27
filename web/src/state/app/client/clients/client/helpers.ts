import { ClientEdit } from '../';

export const newClient = (client: Partial<ClientEdit> = {}): ClientEdit => ({
    id: "",
    clientTypeId: "",
    firstName: "",
    lastName: "",
    maidenName: "",
    idNumber: "",
    passportNumber: "",
    initials: "",
    preferredName: "",
    dateOfBirth: "",
    marriageDate: "",
    marritalStatusId: "",
    taxNumber: "",
    ...client,
});

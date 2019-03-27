import { CLIENT_TYPE_INDIVIDUAL_ID } from '@/state/app/directory/lookups';

import { ClientEdit } from '../';

export const newClient = (client: Partial<ClientEdit> = {}): ClientEdit => ({
    id: "",
    clientTypeId: CLIENT_TYPE_INDIVIDUAL_ID,
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

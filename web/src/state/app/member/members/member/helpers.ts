import { MemberEdit } from '../';

export const newMember = (): MemberEdit => ({
    id: null,
    firstName: '',
    lastName: '',
    maidenName: '',
    idNumber: '',
    passportNumber: '',
    initials: '',
    preferredName: '',
    dateOfBirth: '',
    marriageDate: '',
    marritalStatusId: '',
    taxNumber: ''
});

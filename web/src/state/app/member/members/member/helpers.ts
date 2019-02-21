import { MemberEdit } from '../';

export const newMember = (): MemberEdit => ({
    id: '',
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

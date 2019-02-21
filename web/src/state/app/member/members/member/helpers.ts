import { MemberEdit } from '../';

export const newMember = (member: Partial<MemberEdit> = {}): MemberEdit => ({
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
    taxNumber: '',
    ...member
});

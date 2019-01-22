export type Member = {
    id: string;
    firstName: string;
    lastName: string;
    maidenName: string;
    initials: string;
    preferredName: string;
    idNumber: string;
    passportNumber: string;
    dateOfBirth: string;
    taxNumber: string;
    marritalStatusId: string;
    marriageDate: string;
};

export type MemberEdit = {
    id: string | null;
    firstName: string;
    lastName: string;
    maidenName: string;
    initials: string;
    preferredName: string;
    idNumber: string;
    passportNumber: string;
    dateOfBirth: string;
    taxNumber: string;
    marritalStatusId: string;
    marriageDate: string;
};

export type MemberPreview = {
    id: string;
    firstName: string;
    lastName: string;
    idNumber: string;
    dateOfBirth: string | null;

    policyCount: number;
};

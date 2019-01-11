export type Member = {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    maidenName: string;
    initials: string;
    preferredName: string;
    idNumber: string;
    dateOfBirth: string;
    userFirstName: string;
    userLastName: string;
};

export type MemberEdit = {
    id: string | null;
    userId: string;
    firstName: string;
    lastName: string;
    maidenName: string;
    initials: string;
    preferredName: string;
    idNumber: string;
    dateOfBirth: string;
};

export type MemberPreview = {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    idNumber: string;
    dateOfBirth: string | null;

    userFirstName: string;
    userLastName: string;

    policyCount: number;
};

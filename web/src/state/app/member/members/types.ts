export type Member = {
    id: string;
    firstName: string;
    lastName: string;
    maidenName: string;
    initials: string;
    preferredName: string;
    idNumber: string;
    dateOfBirth: string;
};

export type MemberEdit = {
    id: string | null;
    firstName: string;
    lastName: string;
    maidenName: string;
    initials: string;
    preferredName: string;
    idNumber: string;
    dateOfBirth: string;
};

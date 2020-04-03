import { UserType } from "../types";

export const getUserTypeName = (userTypeId: string, userTypes: UserType[]): string => {
    const userType = userTypes.find((c) => c.id === userTypeId);

    if (!userType) return "";

    return userType.name;
};

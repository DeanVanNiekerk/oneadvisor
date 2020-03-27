import { CommissionEarningsType } from "../types";

export const getCommissionEarningsTypeName = (
    commissionEarningsTypeId: string,
    commissionEarningsTypes: CommissionEarningsType[]
): string => {
    const type = commissionEarningsTypes.find((u) => u.id === commissionEarningsTypeId);

    if (!type) return "";

    return type.name;
};

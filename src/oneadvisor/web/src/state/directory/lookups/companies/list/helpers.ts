import { Company } from "../types";

export const getCompanyName = (companyId: string, companies: Company[]): string => {
    const company = companies.find((c) => c.id === companyId);

    if (!company) return "";

    return company.name;
};

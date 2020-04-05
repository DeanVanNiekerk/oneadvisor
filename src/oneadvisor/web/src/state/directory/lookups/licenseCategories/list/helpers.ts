import { LicenseCategory } from "../types";

export const getLicenseCategoryName = (
    licenseCategoryId: string,
    licenseCategories: LicenseCategory[]
): string => {
    const licenseCategory = licenseCategories.find((c) => c.id === licenseCategoryId);

    if (!licenseCategory) return "";

    return licenseCategory.name;
};

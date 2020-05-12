import { format } from "@/app/utils";
import { RoaInvestData } from "@/state/compliance/roa/invest/data/types";

export type SubstituteProperties = Pick<
    RoaInvestData,
    | "clientFullName"
    | "clientIdNumber"
    | "clientAge"
    | "contributionLumpsum"
    | "contributionMonthly"
    | "clientYearsToRetirement"
    | "lifeExpectancy"
    | "needLumpsum"
    | "needMonthly"
    | "retirementAge"
    | "userOrganisationName"
    | "userFullName"
    | "rateOfReturn"
>;

export const substituteText = (text: string, data: RoaInvestData): string => {
    const properties: SubstituteProperties = {
        clientFullName: data.clientFullName,
        clientIdNumber: data.clientIdNumber,
        clientAge: data.clientAge,
        contributionLumpsum: data.contributionLumpsum,
        contributionMonthly: data.contributionMonthly,
        clientYearsToRetirement: data.clientYearsToRetirement,
        lifeExpectancy: data.lifeExpectancy,
        needLumpsum: data.needLumpsum,
        needMonthly: data.needMonthly,
        retirementAge: data.retirementAge,
        userOrganisationName: data.userOrganisationName,
        userFullName: data.userFullName,
        rateOfReturn: data.rateOfReturn,
    };

    return format(text, properties);
};

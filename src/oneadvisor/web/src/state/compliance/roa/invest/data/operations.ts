import { AnyAction } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

import { formatCurrency, getAge } from "@/app/utils";
import {
    userFullNameSelector,
    userOrganisationIdSelector,
    userOrganisationNameSelector,
} from "@/state/auth/token/selectors";
import { getOrganisationLogoFileInfo } from "@/state/directory/organisations";
import { getFileAsDataUrl } from "@/state/file";
import {
    getClient,
    policyProductTypesSelector,
    policyTypeCharacteristicsSelector,
} from "@/state/lookups/client";
import { organisationCompaniesSelector } from "@/state/lookups/directory";
import { RootState } from "@/state/types";

import {
    receiveData,
    receiveFetching,
    roaInvestCalculatedRiskProfileCodeSelector,
    roaInvestInputsSelector,
    roaInvestLookupsSelector,
    roaInvestRiskCaptureModeSelector,
    roaInvestRiskProfileScoreSelector,
    roaInvestRiskQuestionAnswersSelector,
    roaInvestRiskQuestionsSelector,
} from "../";
import { Investment } from "../inputs/types";
import { RiskProfileCaptureMode } from "../risk/types";
import { InvestmentData, ProductTypeCharacteristics, RiskQuestion, RoaInvestData } from "./types";

type Dispatch = ThunkDispatch<RootState, {}, AnyAction>;

export const loadRoaInvestData = (): ThunkAction<void, RootState, {}, AnyAction> => {
    return async (dispatch, getState) => {
        dispatch(receiveFetching(true));

        const rootState = getState();

        const organisationId = userOrganisationIdSelector(rootState);

        const inputs = roaInvestInputsSelector(rootState);

        const { fullName, idNumber, age, yearsToRetirement } = await getClientDetails(
            dispatch,
            inputs.clientId,
            inputs.retirementAge
        );
        const userFullName = userFullNameSelector(rootState);

        const logoDataUrl = await getOrganisationLogoDataUrl(dispatch, organisationId);

        const discussedCompanyNames = getCompanyNames(rootState, inputs.discussedCompanyIds);
        const discussedProductTypeNames = getProductTypeNames(
            rootState,
            inputs.discussedProductTypeIds
        );

        const recommendedCompanyNames = getCompanyNames(rootState, inputs.recommendedCompanyIds);
        const recommendedProductTypeNames = getProductTypeNames(
            rootState,
            inputs.recommendedProductTypeIds
        );

        const currencyDecimal = 0;

        let riskScore: number | null = roaInvestRiskProfileScoreSelector(rootState);
        const captureMode = roaInvestRiskCaptureModeSelector(rootState);

        if (captureMode === "manual") riskScore = null;

        const riskProfileCode = roaInvestCalculatedRiskProfileCodeSelector(rootState);

        const data: RoaInvestData = {
            clientFullName: fullName,
            clientIdNumber: idNumber,
            clientAge: age,
            clientYearsToRetirement: yearsToRetirement,
            userFullName: userFullName,
            userOrganisationName: userOrganisationNameSelector(rootState),
            logoDataUrl: logoDataUrl,
            consultReason: inputs.consultReason,
            investmentAdviceType: getInvestmentAdviceTypeName(
                rootState,
                inputs.investmentAdviceTypeCode
            ),
            needMonthly: formatCurrency(inputs.needMonthly, currencyDecimal),
            needLumpsum: formatCurrency(inputs.needLumpsum, currencyDecimal),
            contributionMonthly: formatCurrency(inputs.contributionMonthly, currencyDecimal),
            contributionLumpsum: formatCurrency(inputs.contributionLumpsum, currencyDecimal),
            lifeExpectancy: formatNumber(inputs.lifeExpectancy),
            retirementAge: formatNumber(inputs.retirementAge),
            rateOfReturn: getRateOfReturnName(rootState, inputs.rateOfReturnCode),

            discussedProductTypes: discussedProductTypeNames,
            discussedCompanies: discussedCompanyNames,
            discussedFunds: inputs.discussedFundCodes,

            recommendedProductTypes: recommendedProductTypeNames,
            recommendedCompanies: recommendedCompanyNames,
            recommendedFunds: inputs.recommendedFundCodes,
            recommendedAction: inputs.recommendedAction,

            clientChoice: inputs.clientChoice,

            investments: inputs.investments.map((investment, index) =>
                getInvestmentData(rootState, index, investment, currencyDecimal)
            ),

            riskProfileCode: riskProfileCode,
            riskProfileName: getRiskProfileName(rootState, riskProfileCode),
            riskScore: riskScore,
            riskQuestions: getRiskQuestions(rootState, captureMode),
        };

        dispatch(receiveData(data));

        dispatch(receiveFetching(false));
    };
};

type ClientDetails = {
    fullName: string;
    idNumber: string;
    age: string;
    yearsToRetirement: string;
};
const getClientDetails = (
    dispatch: Dispatch,
    clientId: string | null,
    retirementAge: number | null
): Promise<ClientDetails> => {
    let fullName = "";
    let idNumber = "";
    let age = "";
    let yearsToRetirement = "";

    if (!clientId) return Promise.resolve({ fullName, idNumber, age, yearsToRetirement });

    return new Promise<ClientDetails>((resolve) => {
        dispatch(
            getClient(
                clientId,
                //Success
                (client) => {
                    fullName = `${client.firstName ? client.firstName : ""} ${client.lastName}`;
                    idNumber = client.idNumber;

                    const ageNumber = getAge(client.dateOfBirth);
                    age = ageNumber != null ? ageNumber.toString() : "";

                    if (ageNumber && retirementAge)
                        yearsToRetirement = (retirementAge - ageNumber).toString();
                },
                //Always
                () => {
                    resolve({ fullName, idNumber, age, yearsToRetirement });
                }
            )
        );
    });
};

const getInvestmentAdviceTypeName = (
    state: RootState,
    investmentAdviceTypeCode: string
): string => {
    const lookups = roaInvestLookupsSelector(state);
    const type = lookups.investmentAdviceTypes.find((t) => t.code === investmentAdviceTypeCode);
    if (!type) return "";
    return type.name;
};

const getRiskProfileName = (state: RootState, riskProfileCode: string): string => {
    const lookups = roaInvestLookupsSelector(state);
    const profile = lookups.riskProfiles.find((r) => r.code === riskProfileCode);
    if (!profile) return "";
    return profile.name;
};

const getRateOfReturnName = (state: RootState, rateOfReturnCode: string): string => {
    const lookups = roaInvestLookupsSelector(state);
    const type = lookups.rateOfReturns.find((r) => r.code === rateOfReturnCode);
    if (!type) return "";
    return type.name;
};

const getCompanyNames = (state: RootState, companyIds: string[]): string[] => {
    const companies = organisationCompaniesSelector(state);
    return companies.filter((c) => companyIds.indexOf(c.id) != -1).map((c) => c.name);
};

const getProductTypeNames = (state: RootState, productTypeIds: string[]): string[] => {
    const productTypes = policyProductTypesSelector(state).items;
    return productTypes.filter((c) => productTypeIds.indexOf(c.id) != -1).map((c) => c.name);
};

const getInvestmentData = (
    state: RootState,
    index: number,
    investment: Investment,
    currencyDecimal: number
): InvestmentData => {
    let companyName = "";
    const companyNames = getCompanyNames(state, [investment.companyId]);
    if (companyNames.length > 0) companyName = companyNames[0];

    let productTypeName = "";
    const productTypeNames = getProductTypeNames(state, [investment.productTypeId]);
    if (productTypeNames.length > 0) productTypeName = productTypeNames[0];

    let upfrontFee = "Refer to quotation";
    if (investment.upfrontFeePercent != null && investment.upfrontFeePercent != undefined)
        upfrontFee = formatPercent(investment.upfrontFeePercent);
    else if (investment.upfrontFeeAmount != null && investment.upfrontFeeAmount != undefined)
        upfrontFee = formatCurrency(investment.upfrontFeeAmount, currencyDecimal);

    const data: InvestmentData = {
        number: (index + 1).toString(),
        companyName: companyName,
        productTypeName: productTypeName,
        funds: investment.fundCodes,
        contributionLumpsum: formatCurrency(investment.contributionLumpsum, currencyDecimal),
        contributionPremium: formatCurrency(investment.contributionPremium, currencyDecimal),
        upfrontFee: upfrontFee,
        assetManagementFee: formatPercent(
            investment.assetManagementFeePercent,
            "Refer to quotation"
        ),
        productCharacteristics: getProductCharacteristics(state, investment.productTypeId),
    };

    return data;
};

const getProductCharacteristics = (
    state: RootState,
    productTypeId: string
): ProductTypeCharacteristics[] => {
    const productTypes = policyProductTypesSelector(state).items;
    const characteristics = policyTypeCharacteristicsSelector(state).items;

    const productType = productTypes.find((p) => p.id === productTypeId);

    if (!productType) return [];

    return productType.policyTypeCharacteristics.map((c) => {
        let name = "";

        const characteristic = characteristics.find((ch) => ch.id === c.policyTypeCharacteristicId);

        if (!!characteristic) name = characteristic.name;

        return {
            name: name,
            description: c.description,
        };
    });
};

const getRiskQuestions = (
    state: RootState,
    captureMode: RiskProfileCaptureMode
): RiskQuestion[] => {
    if (captureMode === "manual") return [];

    const questions = roaInvestRiskQuestionsSelector(state);
    const answers = roaInvestRiskQuestionAnswersSelector(state);

    return questions.map((q) => {
        const riskQuestion: RiskQuestion = {
            text: q.text,
            answers: q.answers.map((a) => {
                return {
                    text: a.text,
                    isSelected: answers[q.code] === a.code,
                };
            }),
        };
        return riskQuestion;
    });
};

const getOrganisationLogoDataUrl = async (
    dispatch: Dispatch,
    organisationId: string | null
): Promise<string> => {
    if (!organisationId) return Promise.resolve("");

    const url = await getOrganisationLogoFileUrl(dispatch, organisationId);

    if (!url) return Promise.resolve("");

    return new Promise<string>((resolve) => {
        dispatch(
            getFileAsDataUrl(
                url,
                //Success
                (url) => {
                    resolve(url);
                },
                //Failure
                () => {
                    resolve("");
                }
            )
        );
    });
};

const getOrganisationLogoFileUrl = (
    dispatch: Dispatch,
    organisationId: string | null
): Promise<string> => {
    let url = "";

    if (!organisationId) return Promise.resolve(url);

    return new Promise<string>((resolve) => {
        dispatch(
            getOrganisationLogoFileInfo(
                organisationId,
                //Success
                (fileInfo) => {
                    url = fileInfo.url;
                },
                undefined,
                //Always
                () => {
                    resolve(url);
                }
            )
        );
    });
};

const formatPercent = (value: number | null, fallback = ""): string => {
    if (value === null || value === undefined) return fallback;
    return `${value.toString()}%`;
};

const formatNumber = (value: number | null, fallback = ""): string => {
    if (value === null || value === undefined) return fallback;
    return value.toString();
};

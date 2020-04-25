import { defaultState, reducer } from "./reducer";

describe("roa invest reducer", () => {
    it("should handle COMPLIANCE_ROA_INVEST_INPUT_CLIENTID_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_CLIENTID_RECEIVE",
            payload: "1234",
        });

        const expectedState = {
            ...defaultState,
            clientId: "1234",
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_CONSULT_REASON_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_CONSULT_REASON_RECEIVE",
            payload: "some reason",
        });

        const expectedState = {
            ...defaultState,
            consultReason: "some reason",
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_PRODUCTTYPEIDS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_PRODUCTTYPEIDS_RECEIVE",
            payload: ["id1", "id2"],
        });

        const expectedState = {
            ...defaultState,
            productTypeIds: ["id1", "id2"],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_COMPANYIDS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_COMPANYIDS_RECEIVE",
            payload: ["id1", "id2"],
        });

        const expectedState = {
            ...defaultState,
            companyIds: ["id1", "id2"],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_FUNDS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_FUNDS_RECEIVE",
            payload: ["f1", "f2"],
        });

        const expectedState = {
            ...defaultState,
            funds: ["f1", "f2"],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_ADVISOR_RECOMMENDATION_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_ADVISOR_RECOMMENDATION_RECEIVE",
            payload: "some recommendation",
        });

        const expectedState = {
            ...defaultState,
            advisorRecommendation: "some recommendation",
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_INVEST_REC_PREMIUM_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_INVEST_REC_PREMIUM_RECEIVE",
            payload: 100,
        });

        const expectedState = {
            ...defaultState,
            investmentRecurringPremium: 100,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_INVEST_LUMPSUM_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_INVEST_LUMPSUM_RECEIVE",
            payload: 100,
        });

        const expectedState = {
            ...defaultState,
            investmentLumpsum: 100,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_RET_REC_PREMIUM_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_RET_REC_PREMIUM_RECEIVE",
            payload: 100,
        });

        const expectedState = {
            ...defaultState,
            retirementPolicyRecurringPremium: 100,
        };

        expect(actualState).toEqual(expectedState);
    });
});

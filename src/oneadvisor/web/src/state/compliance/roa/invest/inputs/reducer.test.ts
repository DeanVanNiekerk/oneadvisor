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

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_INVESTMENTADVICETYPECODE_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_INVESTMENTADVICETYPECODE_RECEIVE",
            payload: "code1",
        });

        const expectedState = {
            ...defaultState,
            investmentAdviceTypeCode: "code1",
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_NEEDMONTHLY_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_NEEDMONTHLY_RECEIVE",
            payload: 1,
        });

        const expectedState = {
            ...defaultState,
            needMonthly: 1,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_NEEDLUMPSUM_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_NEEDLUMPSUM_RECEIVE",
            payload: 1,
        });

        const expectedState = {
            ...defaultState,
            needLumpsum: 1,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_CONTRIBUTIONMONTHLY_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_CONTRIBUTIONMONTHLY_RECEIVE",
            payload: 2,
        });

        const expectedState = {
            ...defaultState,
            contributionMonthly: 2,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_CONTRIBUTIONLUMPSUM_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_CONTRIBUTIONLUMPSUM_RECEIVE",
            payload: 100,
        });

        const expectedState = {
            ...defaultState,
            contributionLumpsum: 100,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDPRODUCTTYPEIDS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDPRODUCTTYPEIDS_RECEIVE",
            payload: ["id1", "id2"],
        });

        const expectedState = {
            ...defaultState,
            discussedProductTypeIds: ["id1", "id2"],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDCOMPANYIDS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDCOMPANYIDS_RECEIVE",
            payload: ["id1", "id2"],
        });

        const expectedState = {
            ...defaultState,
            discussedCompanyIds: ["id1", "id2"],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDFUNDS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_DISCUSSEDFUNDS_RECEIVE",
            payload: ["id1", "id2"],
        });

        const expectedState = {
            ...defaultState,
            discussedFunds: ["id1", "id2"],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDPRODUCTTYPEIDS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDPRODUCTTYPEIDS_RECEIVE",
            payload: ["id1", "id2"],
        });

        const expectedState = {
            ...defaultState,
            recommendedProductTypeIds: ["id1", "id2"],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDCOMPANYIDS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDCOMPANYIDS_RECEIVE",
            payload: ["id1", "id2"],
        });

        const expectedState = {
            ...defaultState,
            recommendedCompanyIds: ["id1", "id2"],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDFUNDS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDFUNDS_RECEIVE",
            payload: ["id1", "id2"],
        });

        const expectedState = {
            ...defaultState,
            recommendedFunds: ["id1", "id2"],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDACTION_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_RECOMMENDEDACTION_RECEIVE",
            payload: "some action",
        });

        const expectedState = {
            ...defaultState,
            recommendedAction: "some action",
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_INPUT_CLIENTCHOICE_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_INPUT_CLIENTCHOICE_RECEIVE",
            payload: "some choice",
        });

        const expectedState = {
            ...defaultState,
            clientChoice: "some choice",
        };

        expect(actualState).toEqual(expectedState);
    });
});

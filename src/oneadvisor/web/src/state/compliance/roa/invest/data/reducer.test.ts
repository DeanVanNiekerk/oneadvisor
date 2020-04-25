import { defaultState, reducer } from "./reducer";
import { RoaInvestData } from "./types";

describe("roa invest reducer", () => {
    it("should handle COMPLIANCE_ROA_INVEST_DATA_FETCHING_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_DATA_FETCHING_RECEIVE",
            payload: true,
        });

        const expectedState = {
            ...defaultState,
            fetching: true,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle COMPLIANCE_ROA_INVEST_DATA_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const data: RoaInvestData = {
            clientFullName: "Dean van Zoning",
            consultReason: "Get your life sorted",
            companyNames: [],
            productTypeNames: [],
        };

        const actualState = reducer(initalState, {
            type: "COMPLIANCE_ROA_INVEST_DATA_RECEIVE",
            payload: data,
        });

        const expectedState = {
            ...defaultState,
            data: data,
        };

        expect(actualState).toEqual(expectedState);
    });
});

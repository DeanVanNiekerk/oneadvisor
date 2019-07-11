import { defaultState, reducer } from "./reducer";

describe("CommissionStatementTemplateGroupFieldName list reducer", () => {
	it("should handle COMMISSIONSTATEMENTTEMPLATEGROUPFIELDNAMES_LIST_RECEIVE", () => {
		const initalState = {
			...defaultState,
		};

		const commissionStatementTemplateGroupFieldName = {
			id: "10",
			name: "Type 1",
		};

		const actualState = reducer(initalState, {
			type: "COMMISSIONSTATEMENTTEMPLATEGROUPFIELDNAMES_LIST_RECEIVE",
			payload: [commissionStatementTemplateGroupFieldName],
		});

		const expectedState = {
			...defaultState,
			items: [commissionStatementTemplateGroupFieldName],
		};

		expect(actualState).toEqual(expectedState);
	});
});

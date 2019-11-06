import { userEarningsTypeMonthlyCommissionSelector } from "./selectors";

describe("report user monthly commission selectors", () => {
    it("userEarningsTypeMonthlyCommissionSelector", () => {
        const state = {
            app: {
                commission: {
                    lookups: {
                        commissionEarningsTypes: {
                            list: [],
                        },
                    },
                    reports: {
                        userEarningsTypeMonthlyCommission: {
                            property: "1",
                        },
                    },
                },
            },
        };

        const expected = {
            property: "1",
        };

        //@ts-ignore
        const actual = userEarningsTypeMonthlyCommissionSelector(state);

        expect(actual).toEqual(expected);
    });
});

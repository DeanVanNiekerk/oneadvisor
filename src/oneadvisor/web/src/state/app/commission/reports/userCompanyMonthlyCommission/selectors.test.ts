import { userCompanyMonthlyCommissionSelector } from "./selectors";

describe("report user monthly commission selectors", () => {
    it("userCompanyMonthlyCommissionSelector", () => {
        const state = {
            app: {
                commission: {
                    reports: {
                        userCompanyMonthlyCommission: {
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
        const actual = userCompanyMonthlyCommissionSelector(state);

        expect(actual).toEqual(expected);
    });
});

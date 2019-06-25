import { userMonthlyCommissionSelector } from './selectors';

describe("report user monthly commission selectors", () => {
    it("userMonthlyCommissionSelector", () => {
        const state = {
            app: {
                commission: {
                    reports: {
                        userMonthlyCommission: {
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
        const actual = userMonthlyCommissionSelector(state);

        expect(actual).toEqual(expected);
    });
});

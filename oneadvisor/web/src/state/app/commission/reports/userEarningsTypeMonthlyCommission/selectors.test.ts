import { listSelector } from './selectors';

describe("report user monthly commission selectors", () => {
    it("listSelector", () => {
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
        const actual = listSelector(state);

        expect(actual).toEqual(expected);
    });
});

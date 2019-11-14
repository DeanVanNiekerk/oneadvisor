import { clientRevenueSelector } from "./selectors";

describe("report client revenue selectors", () => {
    it("clientRevenueSelector", () => {
        const state = {
            app: {
                commission: {
                    reports: {
                        clientRevenue: {
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
        const actual = clientRevenueSelector(state);

        expect(actual).toEqual(expected);
    });
});

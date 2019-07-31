import { commissionProjectionsSelector } from "./selectors";

describe("report commission projections selectors", () => {
    it("listSelector", () => {
        const state = {
            app: {
                commission: {
                    reports: {
                        projections: {
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
        const actual = commissionProjectionsSelector(state);

        expect(actual).toEqual(expected);
    });
});

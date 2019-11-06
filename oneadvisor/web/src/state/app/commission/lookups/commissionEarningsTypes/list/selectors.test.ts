import { commissionEarningsTypesSelector } from "./selectors";

describe("commissionEarningsType list selectors", () => {
    it("commissionEarningsTypesSelector", () => {
        const state = {
            app: {
                commission: {
                    lookups: {
                        commissionEarningsTypes: {
                            list: {
                                property: "1",
                            },
                        },
                    },
                },
            },
        };

        const expected = {
            property: "1",
        };

        //@ts-ignore
        const actual = commissionEarningsTypesSelector(state);

        expect(actual).toEqual(expected);
    });
});

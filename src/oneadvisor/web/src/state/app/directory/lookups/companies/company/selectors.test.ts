import { companySelector } from "./selectors";

describe("company selectors", () => {
    it("companySelector", () => {
        const state = {
            app: {
                directory: {
                    lookups: {
                        companies: {
                            company: {
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
        const actual = companySelector(state);

        expect(actual).toEqual(expected);
    });
});

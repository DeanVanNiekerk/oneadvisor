import { policyProductTypeSelector } from "./selectors";

describe("policyProductType selectors", () => {
    it("policyProductTypeSelector", () => {
        const state = {
            app: {
                client: {
                    lookups: {
                        policyProductTypes: {
                            policyProductType: {
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
        const actual = policyProductTypeSelector(state);

        expect(actual).toEqual(expected);
    });
});

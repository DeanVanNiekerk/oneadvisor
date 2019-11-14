import { policyProductSelector } from "./selectors";

describe("policyProduct selectors", () => {
    it("policyProductSelector", () => {
        const state = {
            app: {
                client: {
                    lookups: {
                        policyProducts: {
                            policyProduct: {
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
        const actual = policyProductSelector(state);

        expect(actual).toEqual(expected);
    });
});

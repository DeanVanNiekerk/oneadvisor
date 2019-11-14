import { policySelector } from "./selectors";

describe("policy selectors", () => {
    it("policySelector", () => {
        const state = {
            app: {
                client: {
                    policies: {
                        policy: {
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
        const actual = policySelector(state);

        expect(actual).toEqual(expected);
    });
});

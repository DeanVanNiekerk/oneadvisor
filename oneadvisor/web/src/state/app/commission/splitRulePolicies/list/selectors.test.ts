import { listSelector } from "./selectors";

describe("splitRulePolicy list selectors", () => {
    it("listSelector", () => {
        const state = {
            app: {
                commission: {
                    splitRulePolicies: {
                        list: {
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

import { splitRulePolicySelector } from './selectors';

describe("splitRulePolicy selectors", () => {
    it("splitRulePolicySelector", () => {
        const state = {
            app: {
                commission: {
                    splitRulePolicies: {
                        splitRulePolicy: {
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
        const actual = splitRulePolicySelector(state);

        expect(actual).toEqual(expected);
    });
});

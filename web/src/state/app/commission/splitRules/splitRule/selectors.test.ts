import { splitRuleSelector } from './selectors';

describe("splitRule selectors", () => {
    it("splitRuleSelector", () => {
        const state = {
            app: {
                commission: {
                    splitRules: {
                        splitRule: {
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
        const actual = splitRuleSelector(state);

        expect(actual).toEqual(expected);
    });
});

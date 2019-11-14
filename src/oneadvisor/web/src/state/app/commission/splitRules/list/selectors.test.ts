import { listSelector } from "./selectors";

describe("splitRule list selectors", () => {
    it("listSelector", () => {
        const state = {
            app: {
                commission: {
                    splitRules: {
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

import { branchesSelector } from "./selectors";

describe("branch list selectors", () => {
    it("branchesSelector", () => {
        const state = {
            app: {
                directory: {
                    branches: {
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
        const actual = branchesSelector(state);

        expect(actual).toEqual(expected);
    });
});

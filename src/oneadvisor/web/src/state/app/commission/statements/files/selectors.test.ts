import { listSelector } from "./selectors";

describe("statementFiles list selectors", () => {
    it("listSelector", () => {
        const state = {
            app: {
                commission: {
                    statements: {
                        files: {
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

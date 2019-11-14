import { statementSelector } from "./selectors";

describe("statement selectors", () => {
    it("statementSelector", () => {
        const state = {
            app: {
                commission: {
                    statements: {
                        statement: {
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
        const actual = statementSelector(state);

        expect(actual).toEqual(expected);
    });
});

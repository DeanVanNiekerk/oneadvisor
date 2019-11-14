import { mappingErrorSelector } from "./selectors";

describe("statement selectors", () => {
    it("statementSelector", () => {
        const state = {
            app: {
                commission: {
                    errors: {
                        mapping: {
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
        const actual = mappingErrorSelector(state);

        expect(actual).toEqual(expected);
    });
});

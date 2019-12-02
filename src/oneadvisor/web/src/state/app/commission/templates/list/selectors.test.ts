import { commissionStatementTemplatesSelector } from "./selectors";

describe("commission list selectors", () => {
    it("commissionStatementTemplatesSelector", () => {
        const state = {
            app: {
                commission: {
                    templates: {
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
        const actual = commissionStatementTemplatesSelector(state);

        expect(actual).toEqual(expected);
    });
});

import { listSelector } from "./selectors";

describe("commission list selectors", () => {
    it("listSelector", () => {
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
        const actual = listSelector(state);

        expect(actual).toEqual(expected);
    });
});

import { organisationsSelector } from "./selectors";

describe("organisation list selectors", () => {
    it("organisationsSelector", () => {
        const state = {
            app: {
                directory: {
                    organisations: {
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
        const actual = organisationsSelector(state);

        expect(actual).toEqual(expected);
    });
});

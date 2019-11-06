import { lookupsSelector } from "./selectors";

describe("directory lookups selectors", () => {
    it("lookupsSelector", () => {
        const state = {
            app: {
                directory: {
                    lookups: {
                        all: {
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
        const actual = lookupsSelector(state);

        expect(actual).toEqual(expected);
    });
});

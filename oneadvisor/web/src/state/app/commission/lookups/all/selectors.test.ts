import { lookupsSelector } from './selectors';

describe("commission lookups selectors", () => {
    it("lookupsSelector", () => {
        const state = {
            app: {
                commission: {
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

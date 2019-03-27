import { listSelector } from './selectors';

describe("policyType list selectors", () => {
    it("listSelector", () => {
        const state = {
            app: {
                directory: {
                    lookups: {
                        clientTypes: {
                            list: {
                                property: "1",
                            },
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

import { listSelector } from "./selectors";

describe("allocation list selectors", () => {
    it("listSelector", () => {
        const state = {
            app: {
                commission: {
                    allocations: {
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

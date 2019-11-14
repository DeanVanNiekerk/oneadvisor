import { allocationSelector } from "./selectors";

describe("allocation selectors", () => {
    it("allocationSelector", () => {
        const state = {
            app: {
                commission: {
                    allocations: {
                        allocation: {
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
        const actual = allocationSelector(state);

        expect(actual).toEqual(expected);
    });
});

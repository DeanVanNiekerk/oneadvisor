import { roleSelector } from "./selectors";

describe("role selectors", () => {
    it("roleSelector", () => {
        const state = {
            app: {
                directory: {
                    roles: {
                        role: {
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
        const actual = roleSelector(state);

        expect(actual).toEqual(expected);
    });
});

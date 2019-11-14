import { userSimpleSelector } from "./selectors";

describe("user simple selectors", () => {
    it("userSimpleSelector", () => {
        const state = {
            app: {
                directory: {
                    usersSimple: {
                        userSimple: {
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
        const actual = userSimpleSelector(state);

        expect(actual).toEqual(expected);
    });
});

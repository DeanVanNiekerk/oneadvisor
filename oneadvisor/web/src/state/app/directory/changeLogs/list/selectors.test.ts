import { listSelector } from "./selectors";

describe("changeLog list selectors", () => {
    it("listSelector", () => {
        const state = {
            app: {
                directory: {
                    changeLogs: {
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

import { listSelector } from "./selectors";

describe("auditLog list selectors", () => {
    it("listSelector", () => {
        const state = {
            app: {
                directory: {
                    audit: {
                        logs: {
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

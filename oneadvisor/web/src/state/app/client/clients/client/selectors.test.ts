import { clientSelector } from "./selectors";

describe("client selectors", () => {
    it("clientSelector", () => {
        const state = {
            app: {
                client: {
                    clients: {
                        client: {
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
        const actual = clientSelector(state);

        expect(actual).toEqual(expected);
    });
});

import { clientMergeSelector } from "./selectors";

describe("client list selectors", () => {
    it("clientMergeSelector", () => {
        const state = {
            app: {
                client: {
                    clients: {
                        merge: {
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
        const actual = clientMergeSelector(state);

        expect(actual).toEqual(expected);
    });
});

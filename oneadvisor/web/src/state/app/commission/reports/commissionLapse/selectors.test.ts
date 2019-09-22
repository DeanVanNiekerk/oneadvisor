import { listSelector } from "./selectors";

describe("report commission lapse selectors", () => {
    it("listSelector", () => {
        const state = {
            app: {
                commission: {
                    reports: {
                        commissionLapse: {
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

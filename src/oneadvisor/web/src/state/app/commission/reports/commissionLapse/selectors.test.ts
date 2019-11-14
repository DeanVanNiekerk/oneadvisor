import { commissionLapseSelector } from "./selectors";

describe("report commission lapse selectors", () => {
    it("commissionLapseSelector", () => {
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
        const actual = commissionLapseSelector(state);

        expect(actual).toEqual(expected);
    });
});

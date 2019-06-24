import { listSelector } from './selectors';

describe("report client revenue selectors", () => {
    it("listSelector", () => {
        const state = {
            app: {
                commission: {
                    reports: {
                        clientRevenue: {
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

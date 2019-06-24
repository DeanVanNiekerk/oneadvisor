import { commissionTypeSelector } from './selectors';

describe("commissionType selectors", () => {
    it("commissionTypeSelector", () => {
        const state = {
            app: {
                commission: {
                    lookups: {
                        commissionTypes: {
                            commissionType: {
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
        const actual = commissionTypeSelector(state);

        expect(actual).toEqual(expected);
    });
});

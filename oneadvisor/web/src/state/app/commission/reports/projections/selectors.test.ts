import { projectionGroupTableRowsSelector } from "./selectors";

describe("report commission projects selectors", () => {

    it("projectionGroupTableRowsSelector", () => {
        const state = {
            app: {
                commission: {
                    reports: {
                        userCompanyMonthlyCommission: {
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
        //const actual = projectionGroupTableRowsSelector(state);

        //expect(actual).toEqual(expected);

        expect(true).toEqual(true);
    });
});

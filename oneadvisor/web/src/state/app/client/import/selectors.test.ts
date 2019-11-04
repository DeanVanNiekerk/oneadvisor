import {
    clientImportProgressPercentSelector,
    clientImportSelectedColumnsSelector,
    clientImportSelector,
    clientImportTableRowsSelector,
} from "./selectors";

describe("client import selectors", () => {
    it("clientImportSelector", () => {
        const state = {
            app: {
                client: {
                    import: {
                        property: "1",
                    },
                },
            },
        };

        const expected = {
            property: "1",
        };

        //@ts-ignore
        const actual = clientImportSelector(state);

        expect(actual).toEqual(expected);
    });

    it("clientImportTableRowsSelector", () => {
        const state = {
            app: {
                client: {
                    import: {
                        selectedColumns: ["idNumber", "lastName", "dateOfBirth"],
                        data: [["val1", "val2", "28520"], ["val3", "val4", "1982-10-03"]],
                    },
                },
            },
        };

        //@ts-ignore
        const actual = clientImportTableRowsSelector(state);

        expect(actual.length).toEqual(2);

        expect(actual[0].idNumber).toEqual("val1");
        expect(actual[0].lastName).toEqual("val2");
        expect(actual[0].dateOfBirth).toEqual("1978-01-30");

        expect(actual[1].idNumber).toEqual("val3");
        expect(actual[1].lastName).toEqual("val4");
        expect(actual[1].dateOfBirth).toEqual("1982-10-03");
    });

    it("clientImportSelectedColumnsSelector", () => {
        const state = {
            app: {
                client: {
                    import: {
                        columns: [
                            {
                                id: "policyNumber",
                                name: "Policy Number",
                            },
                            {
                                id: "lastName",
                                name: "Last Name",
                            },
                            {
                                id: "idNumber",
                                name: "ID Number",
                            },
                        ],
                        selectedColumns: ["idNumber", "lastName"],
                        data: [["val1", "val2"], ["val3", "val4"]],
                    },
                },
            },
        };

        //@ts-ignore
        const actual = clientImportSelectedColumnsSelector(state);

        expect(actual.length).toEqual(2);

        expect(actual[0].id).toEqual("idNumber");
        expect(actual[0].name).toEqual("ID Number");

        expect(actual[1].id).toEqual("lastName");
        expect(actual[1].name).toEqual("Last Name");
    });

    it("clientImportProgressPercentSelector", () => {
        const state = {
            app: {
                client: {
                    import: {
                        clients: [
                            {
                                idNumber: "1",
                            },
                            {
                                idNumber: "2",
                            },
                            {
                                idNumber: "3",
                            },
                            {
                                idNumber: "4",
                            },
                        ],
                        resultsSuccess: ["val1"],
                        resultsFailure: ["val1"],
                    },
                },
            },
        };

        //@ts-ignore
        const percent = clientImportProgressPercentSelector(state);

        expect(percent).toEqual(50);
    });
});

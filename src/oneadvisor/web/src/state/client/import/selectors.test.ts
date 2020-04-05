import { ImportState } from "./";
import {
    clientImportProgressPercentSelector,
    clientImportSelectedColumnsSelector,
    clientImportSelector,
    clientImportTableRowsSelector,
} from "./selectors";

describe("client import selectors", () => {
    const defaultState: ImportState = {
        fileName: "",
        data: [],
        clients: [],
        resultsSuccess: [],
        resultsFailure: [],
        companyId: null,
        currentStepIndex: 0,
        steps: ["Select File", "Configure", "Verify", "Import"],
        selectedColumns: [
            "idNumber",
            "firstName",
            "lastName",
            "email",
            "cellphone",
            "dateOfBirth",
            "taxNumber",
            "policyNumber",
            "policyCompanyId",
            "policyUserFullName",
            "policyPremium",
            "policyTypeCode",
            "policyStartDate",
            "clientTypeCode",
        ],
        columns: [
            {
                id: "idNumber",
                name: "ID Number",
            },
            {
                id: "firstName",
                name: "First Name",
            },
            {
                id: "lastName",
                name: "Last Name",
            },
            {
                id: "email",
                name: "Email",
            },
            {
                id: "cellphone",
                name: "Cellphone",
            },
            {
                id: "dateOfBirth",
                name: "Date of Birth",
            },
            {
                id: "taxNumber",
                name: "Tax Number",
            },
            {
                id: "policyNumber",
                name: "Policy Number",
            },
            {
                id: "policyCompanyId",
                name: "Policy Company Id",
            },
            {
                id: "policyUserFullName",
                name: "Policy Broker",
            },
            {
                id: "policyPremium",
                name: "Policy Premium",
            },
            {
                id: "policyTypeCode",
                name: "Policy Type Code",
            },
            {
                id: "policyStartDate",
                name: "Policy Start Date",
            },
            {
                id: "clientTypeCode",
                name: "Client Type Code",
            },
        ],
    };

    it("clientImportSelector", () => {
        const actual = clientImportSelector.resultFunc(defaultState);

        expect(actual).toEqual(defaultState);
    });

    it("clientImportTableRowsSelector", () => {
        const state: ImportState = {
            ...defaultState,
            selectedColumns: ["idNumber", "lastName", "dateOfBirth"],
            data: [
                ["val1", "val2", "28520"],
                ["val3", "val4", "1982-10-03"],
            ],
        };

        const actual = clientImportTableRowsSelector.resultFunc(state);

        expect(actual.length).toEqual(2);

        expect(actual[0].idNumber).toEqual("val1");
        expect(actual[0].lastName).toEqual("val2");
        expect(actual[0].dateOfBirth).toEqual("1978-01-30");

        expect(actual[1].idNumber).toEqual("val3");
        expect(actual[1].lastName).toEqual("val4");
        expect(actual[1].dateOfBirth).toEqual("1982-10-03");
    });

    it("clientImportSelectedColumnsSelector", () => {
        const state: ImportState = {
            ...defaultState,
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
            data: [
                ["val1", "val2"],
                ["val3", "val4"],
            ],
        };

        //@ts-ignore
        const actual = clientImportSelectedColumnsSelector.resultFunc(state);

        expect(actual.length).toEqual(2);

        expect(actual[0].id).toEqual("idNumber");
        expect(actual[0].name).toEqual("ID Number");

        expect(actual[1].id).toEqual("lastName");
        expect(actual[1].name).toEqual("Last Name");
    });

    it("clientImportProgressPercentSelector", () => {
        const state: ImportState = {
            ...defaultState,
            clients: [
                {
                    _id: "11",
                    idNumber: "1",
                },
                {
                    _id: "22",
                    idNumber: "2",
                },
                {
                    _id: "33",
                    idNumber: "3",
                },
                {
                    _id: "44",
                    idNumber: "4",
                },
            ],
            resultsSuccess: [
                {
                    _id: "11",
                    idNumber: "1",
                },
            ],
            resultsFailure: [
                {
                    _id: "22",
                    error: "dang it!",
                    importClient: {
                        _id: "22",
                        idNumber: "2",
                    },
                },
            ],
        };

        //@ts-ignore
        const percent = clientImportProgressPercentSelector.resultFunc(state);

        expect(percent).toEqual(50);
    });
});

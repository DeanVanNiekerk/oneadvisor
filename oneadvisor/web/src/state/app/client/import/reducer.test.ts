import { ImportClient, ImportColumn, ImportData } from "./";
import { defaultState, reducer } from "./reducer";

describe("client import reducer", () => {
    it("should handle CLIENTS_IMPORT_DATA_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const data: ImportData = [["val1", "val2"], ["val3", "val4"]];

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_DATA_RECEIVE",
            payload: data,
        });

        const expectedState = {
            ...defaultState,
            data: [...data],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_IMPORT_COLUMNS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const columns: ImportColumn[] = [
            {
                id: "idNumber",
                name: "ID Number",
            },
        ];

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_COLUMNS_RECEIVE",
            payload: columns,
        });

        const expectedState = {
            ...defaultState,
            columns: [...columns],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_IMPORT_SELECTED_COLUMNS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
            selectedColumns: [],
        };

        const columns: (keyof ImportClient)[] = ["idNumber"];

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_SELECTED_COLUMNS_RECEIVE",
            payload: columns,
        });

        const expectedState = {
            ...defaultState,
            selectedColumns: [...columns],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_IMPORT_CLIENTS_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const clients: ImportClient[] = [
            {
                _id: "123456",
                idNumber: "8210035032082",
            },
        ];

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_CLIENTS_RECEIVE",
            payload: clients,
        });

        const expectedState = {
            ...defaultState,
            clients: [...clients],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_IMPORT_CLIENTS_REMOVE", () => {
        const initalState = {
            ...defaultState,
            clients: [
                {
                    _id: "1",
                    idNumber: "100",
                },
                {
                    _id: "2",
                    idNumber: "200",
                },
                {
                    _id: "3",
                    idNumber: "300",
                },
            ],
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_CLIENTS_REMOVE",
            payload: "2",
        });

        const expectedState = {
            ...defaultState,
            clients: [
                {
                    _id: "1",
                    idNumber: "100",
                },
                {
                    _id: "3",
                    idNumber: "300",
                },
            ],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_IMPORT_CLIENTS_REMOVE, invalid id", () => {
        const initalState = {
            ...defaultState,
            clients: [
                {
                    _id: "1",
                    idNumber: "100",
                },
                {
                    _id: "2",
                    idNumber: "200",
                },
            ],
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_CLIENTS_REMOVE",
            payload: "3",
        });

        const expectedState = {
            ...defaultState,
            clients: [
                {
                    _id: "1",
                    idNumber: "100",
                },
                {
                    _id: "2",
                    idNumber: "200",
                },
            ],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_IMPORT_CLIENTS_POLICY_COMPANY_RECEIVE", () => {
        const initalState = {
            ...defaultState,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_CLIENTS_POLICY_COMPANY_RECEIVE",
            payload: "1",
        });

        const expectedState = {
            ...defaultState,
            companyId: "1",
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_IMPORT_CLIENTS_NEXT_STEP", () => {
        const initalState = {
            ...defaultState,
            currentStepIndex: 1,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_CLIENTS_NEXT_STEP",
        });

        const expectedState = {
            ...defaultState,
            currentStepIndex: 2,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_IMPORT_CLIENTS_PREVIOUS_STEP", () => {
        const initalState = {
            ...defaultState,
            currentStepIndex: 4,
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_CLIENTS_PREVIOUS_STEP",
        });

        const expectedState = {
            ...defaultState,
            currentStepIndex: 3,
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_IMPORT_CLIENT_SUCCESS", () => {
        const client1 = {
            _id: "1",
            idNumber: "12345",
        };

        const client2 = {
            _id: "2",
            idNumber: "54321",
        };

        const initalState = {
            ...defaultState,
            resultsSuccess: [client1],
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_CLIENT_SUCCESS",
            payload: client2,
        });

        const expectedState = {
            ...defaultState,
            resultsSuccess: [client1, client2],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_IMPORT_CLIENT_FAILURE", () => {
        const result1 = {
            _id: "1",
            importClient: {
                _id: "1",
                idNumber: "12345",
            },
            error: "error 1",
        };

        const result2 = {
            _id: "2",
            importClient: {
                _id: "2",
                idNumber: "54321",
            },
            error: "error 2",
        };

        const initalState = {
            ...defaultState,
            resultsFailure: [result1],
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_CLIENT_FAILURE",
            payload: result2,
        });

        const expectedState = {
            ...defaultState,
            resultsFailure: [result1, result2],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_IMPORT_CLIENT_CLEAR_RESULTS", () => {
        const client1 = {
            _id: "1",
            idNumber: "12345",
        };

        const result1 = {
            _id: "1",
            importClient: {
                _id: "1",
                idNumber: "12345",
            },
            error: "error 1",
        };

        const initalState = {
            ...defaultState,
            resultsSuccess: [client1],
            resultsFailure: [result1],
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_CLIENT_CLEAR_RESULTS",
        });

        const expectedState = {
            ...defaultState,
            resultsSuccess: [],
            resultsFailure: [],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_IMPORT_CLIENTS_UPDATE_POLICY_COMPANIES", () => {
        const initalState = {
            ...defaultState,
            companyId: "2",
            clients: [
                {
                    _id: "123456",
                    idNumber: "8210035032082",
                    policyCompanyId: "1",
                },
            ],
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_CLIENTS_UPDATE_POLICY_COMPANIES",
        });

        const expectedState = {
            ...defaultState,
            companyId: "2",
            clients: [
                {
                    _id: "123456",
                    idNumber: "8210035032082",
                    policyCompanyId: "2",
                },
            ],
        };

        expect(actualState).toEqual(expectedState);
    });

    it("should handle CLIENTS_IMPORT_CLIENT_RESET", () => {
        const initalState = {
            ...defaultState,
            data: [["val1", "val2"], ["val3", "val4"]],
            currentStepIndex: 1,
            companyId: "2",
            clients: [
                {
                    _id: "123456",
                    idNumber: "8210035032082",
                    policyCompanyId: "1",
                },
            ],
            resultsSuccess: [
                {
                    _id: "1",
                    idNumber: "12345",
                },
            ],
            resultsFailure: [
                {
                    _id: "1",
                    importClient: {
                        _id: "1",
                        idNumber: "12345",
                    },
                    error: "error 1",
                },
            ],
        };

        const actualState = reducer(initalState, {
            type: "CLIENTS_IMPORT_CLIENT_RESET",
        });

        const expectedState = {
            ...defaultState,
            data: [],
            clients: [],
            resultsSuccess: [],
            resultsFailure: [],
            companyId: null,
            currentStepIndex: 0,
        };

        expect(actualState).toEqual(expectedState);
    });
});

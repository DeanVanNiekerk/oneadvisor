import { ImportData } from './';
import * as actions from './actions';
import { ImportClient, ImportColumn } from './types';

describe("client: import: actions", () => {
    it("should dispatch CLIENTS_IMPORT_DATA_RECEIVE when receiveClientImportData is called", () => {
        const data: ImportData = [["val1", "val2"], ["val3", "val4"]];

        const expectedAction = {
            type: "CLIENTS_IMPORT_DATA_RECEIVE",
            payload: data,
        };

        expect(actions.receiveClientImportData(data)).toEqual(expectedAction);
    });

    it("should dispatch CLIENTS_IMPORT_COLUMNS_RECEIVE when receiveClientImportColumns is called", () => {
        const columns: ImportColumn[] = [
            {
                id: "idNumber",
                name: "ID Number",
            },
        ];

        const expectedAction = {
            type: "CLIENTS_IMPORT_COLUMNS_RECEIVE",
            payload: columns,
        };

        expect(actions.receiveClientImportColumns(columns)).toEqual(
            expectedAction
        );
    });

    it("should dispatch CLIENTS_IMPORT_SELECTED_COLUMNS_RECEIVE when receiveClientImportSelectedColumns is called", () => {
        const columns: string[] = ["idNumber"];

        const expectedAction = {
            type: "CLIENTS_IMPORT_SELECTED_COLUMNS_RECEIVE",
            payload: columns,
        };

        expect(actions.receiveClientImportSelectedColumns(columns)).toEqual(
            expectedAction
        );
    });

    it("should dispatch CLIENTS_IMPORT_CLIENTS_RECEIVE when receiveClientImportClients is called", () => {
        const clients: ImportClient[] = [
            {
                _id: "123456",
                idNumber: "8210035032082",
            },
        ];

        const expectedAction = {
            type: "CLIENTS_IMPORT_CLIENTS_RECEIVE",
            payload: clients,
        };

        expect(actions.receiveClientImportClients(clients)).toEqual(
            expectedAction
        );
    });

    it("should dispatch CLIENTS_IMPORT_CLIENTS_REMOVE when removeClientImportClient is called", () => {
        const expectedAction = {
            type: "CLIENTS_IMPORT_CLIENTS_REMOVE",
            payload: "123",
        };

        expect(actions.removeClientImportClient("123")).toEqual(expectedAction);
    });

    it("should dispatch CLIENTS_IMPORT_CLIENTS_RECEIVE when receiveClientImportClients is called", () => {
        const expectedAction = {
            type: "CLIENTS_IMPORT_CLIENTS_POLICY_COMPANY_RECEIVE",
            payload: "1",
        };

        expect(actions.receiveClientImportPolicyCompany("1")).toEqual(
            expectedAction
        );
    });

    it("should dispatch CLIENTS_IMPORT_CLIENTS_NEXT_STEP when clientImportNextStep is called", () => {
        const expectedAction = {
            type: "CLIENTS_IMPORT_CLIENTS_NEXT_STEP",
        };

        expect(actions.clientImportNextStep()).toEqual(expectedAction);
    });

    it("should dispatch CLIENTS_IMPORT_CLIENTS_PREVIOUS_STEP when clientImportPreviousStep is called", () => {
        const expectedAction = {
            type: "CLIENTS_IMPORT_CLIENTS_PREVIOUS_STEP",
        };

        expect(actions.clientImportPreviousStep()).toEqual(expectedAction);
    });
});

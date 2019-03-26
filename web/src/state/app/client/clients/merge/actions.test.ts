import { clientsApi } from '@/config/api/client';

import * as actions from './actions';

describe("client: merge: actions", () => {
    it("should dispatch API when fetchMergeClients is called", () => {
        const api = `${clientsApi}?filters=clientId%3D123`;

        const expectedAction = {
            type: "API",
            endpoint: api,
            dispatchPrefix: "CLIENTS_MERGE_SOURCE",
        };

        expect(actions.fetchMergeClients(["123"])).toEqual(expectedAction);
    });

    it("should dispatch CLIENTS_MERGE_NEXT_STEP when clientMergeNextStep is called", () => {
        const expectedAction = {
            type: "CLIENTS_MERGE_NEXT_STEP",
        };

        expect(actions.clientMergeNextStep()).toEqual(expectedAction);
    });

    it("should dispatch CLIENTS_MERGE_PREVIOUS_STEP when clientMergePreviousStep is called", () => {
        const expectedAction = {
            type: "CLIENTS_MERGE_PREVIOUS_STEP",
        };

        expect(actions.clientMergePreviousStep()).toEqual(expectedAction);
    });
});

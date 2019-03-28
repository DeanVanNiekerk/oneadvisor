import { clientsApi } from '@/config/api/client';
import { ClientTypeId } from '@/state/app/directory/lookups';

import { ClientEdit } from '../';
import * as actions from './actions';

describe("client actions", () => {
    it("should dispatch API when fetchClient is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${clientsApi}/99`,
            dispatchPrefix: "CLIENTS_CLIENT",
        };

        expect(actions.fetchClient("99")).toEqual(expectedAction);
    });

    it("should dispatch API when updateClient is called", () => {
        const client: ClientEdit = {
            id: "10",
            clientTypeId: ClientTypeId.Individual,
            firstName: "Dean",
            lastName: "Jackson",
            maidenName: "",
            initials: "DJ",
            preferredName: "ripper",
            alternateIdNumber: "987987",
            idNumber: "12341234",
            dateOfBirth: "1982-10-03",
            marriageDate: "1982-10-02",
            marritalStatusId: "987654",
            taxNumber: "AABB1212",
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: "API",
            endpoint: `${clientsApi}/10`,
            method: "POST",
            payload: client,
            onSuccess: onSuccess,
            dispatchPrefix: "CLIENTS_CLIENT_EDIT",
        };

        expect(actions.updateClient(client, onSuccess)).toEqual(expectedAction);
    });

    it("should dispatch API when deleteClient is called", () => {
        const onSuccess = () => {};

        const expectedAction = {
            type: "API",
            endpoint: `${clientsApi}/10`,
            method: "DELETE",
            onSuccess: onSuccess,
            dispatchPrefix: "CLIENTS_CLIENT_EDIT",
        };

        expect(actions.deleteClient("10", onSuccess)).toEqual(expectedAction);
    });
});

import { clientsApi } from "@/config/api/client";
import { ClientTypeId } from "@/state/lookups/client";

import { ClientPreview } from "../types";
import * as actions from "./actions";

describe("client actions", () => {
    it("should dispatch API when fetchClientPreview is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${clientsApi}/99/preview`,
            dispatchPrefix: "CLIENTS_CLIENT_PREVIEW",
        };

        expect(actions.fetchClientPreview("99")).toEqual(expectedAction);
    });

    it("should dispatch CLIENTS_CLIENT_PREVIEW_RECEIVE when receiveClientPreview is called", () => {
        const client: ClientPreview = {
            id: "10",
            clientTypeId: ClientTypeId.Individual,
            firstName: "Dean",
            lastName: "Jackson",
            idNumber: "12341234",
            alternateIdNumber: "987654",
            dateOfBirth: "1982-10-03",
            policyCount: 2,
            contactCount: 3,
        };

        const expectedAction = {
            type: "CLIENTS_CLIENT_PREVIEW_RECEIVE",
            payload: client,
        };

        expect(actions.receiveClientPreview(client)).toEqual(expectedAction);
    });
});

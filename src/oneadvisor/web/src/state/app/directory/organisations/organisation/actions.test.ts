import { organisationsApi } from "@/config/api/directory";

import { OrganisationEdit } from "../types";
import * as actions from "./actions";

describe("organisation actions", () => {
    it("should dispatch API when fetchOrganisation is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${organisationsApi}/99`,
            dispatchPrefix: "ORGANISATIONS_ORGANISATION",
        };

        expect(actions.fetchOrganisation("99")).toEqual(expectedAction);
    });

    it("should dispatch API when updateOrganisation is called", () => {
        const organisation: OrganisationEdit = {
            id: "10",
            name: "Org1",
            vatRegistered: false,
            vatRegistrationDate: null,
            config: {
                companyIds: [] as string[],
            },
        };

        const expectedAction = {
            type: "API",
            endpoint: `${organisationsApi}/10`,
            method: "POST",
            payload: organisation,
            dispatchPrefix: "ORGANISATIONS_ORGANISATION_EDIT",
        };

        expect(actions.updateOrganisation(organisation)).toEqual(expectedAction);
    });
});

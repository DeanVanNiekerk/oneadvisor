import { commissionTypesApi } from "@/config/api/commission";

import * as actions from "./actions";

describe("commission: commissionTypes: list actions", () => {
    it("should dispatch API when fetchCommissionTypes is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${commissionTypesApi}`,
            dispatchPrefix: "COMMISSIONTYPES_LIST",
        };

        expect(actions.fetchCommissionTypes()).toEqual(expectedAction);
    });
});

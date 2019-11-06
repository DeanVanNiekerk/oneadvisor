import { allocationsApi } from "@/config/api/commission";

import * as actions from "./actions";

describe("directory: allocations: list actions", () => {
    it("should dispatch API when fetchAllocations is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${allocationsApi}?filters=clientId%3D132456`,
            dispatchPrefix: "ALLOCATIONS_LIST",
        };

        expect(actions.fetchAllocations({ clientId: ["132456"] })).toEqual(expectedAction);
    });
});

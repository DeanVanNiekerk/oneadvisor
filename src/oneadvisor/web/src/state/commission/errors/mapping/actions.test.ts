import { statementsApi } from "@/config/api/commission";

import * as actions from "./actions";

describe("commission mapping error actions", () => {
    it("should dispatch API when fetchNextMappingError is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${statementsApi}/99/errors/next`,
            dispatchPrefix: "COMMISSIONS_ERROR_MAPPING",
        };

        expect(actions.fetchNextMappingError("99")).toEqual(expectedAction);
    });
});

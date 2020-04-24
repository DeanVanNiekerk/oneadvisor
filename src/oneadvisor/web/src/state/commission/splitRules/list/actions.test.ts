import { splitRulesApi } from "@/config/api/commission";

import * as actions from "./actions";

describe("commission: splitRules: list actions", () => {
    it("should dispatch API when fetchSplitRules is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${splitRulesApi}?filters=userId%3D132456`,
            dispatchPrefix: "SPLITRULES_LIST",
        };

        expect(actions.fetchSplitRules({ userId: ["132456"] })).toEqual(expectedAction);
    });
});

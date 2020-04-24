import { adviceScopesApi } from "@/config/api/directory";

import { AdviceScopeEdit } from "../types";
import * as actions from "./actions";

describe("adviceScope actions", () => {
    it("should dispatch API when updateAdviceScope is called", () => {
        const adviceScope: AdviceScopeEdit = {
            id: "10",
            name: "n1",
        };

        const expectedAction = {
            type: "API",
            endpoint: `${adviceScopesApi}/10`,
            method: "POST",
            payload: adviceScope,
            dispatchPrefix: "ADVICESCOPES_ADVICESCOPE_EDIT",
        };

        expect(actions.updateAdviceScope(adviceScope)).toEqual(expectedAction);
    });
});

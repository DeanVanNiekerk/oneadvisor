import { adviceScopesApi } from "@/config/api/directory";

import * as actions from "./actions";

describe("directory: adviceScopes: list actions", () => {
    it("should dispatch API when fetchAdviceScopes is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${adviceScopesApi}`,
            dispatchPrefix: "ADVICESCOPES_LIST",
        };

        expect(actions.fetchAdviceScopes()).toEqual(expectedAction);
    });
});

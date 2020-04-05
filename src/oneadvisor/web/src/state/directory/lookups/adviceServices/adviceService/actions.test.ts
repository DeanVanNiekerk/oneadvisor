import { adviceServicesApi } from "@/config/api/directory";

import { AdviceServiceEdit } from "../types";
import * as actions from "./actions";

describe("adviceService actions", () => {
    it("should dispatch API when updateAdviceService is called", () => {
        const adviceService: AdviceServiceEdit = {
            id: "10",
            name: "n1",
        };

        const expectedAction = {
            type: "API",
            endpoint: `${adviceServicesApi}/10`,
            method: "POST",
            payload: adviceService,
            dispatchPrefix: "ADVICESERVICES_ADVICESERVICE_EDIT",
        };

        expect(actions.updateAdviceService(adviceService)).toEqual(expectedAction);
    });
});

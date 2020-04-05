import { adviceServicesApi } from "@/config/api/directory";

import * as actions from "./actions";

describe("directory: adviceServices: list actions", () => {
    it("should dispatch API when fetchAdviceServices is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${adviceServicesApi}`,
            dispatchPrefix: "ADVICESERVICES_LIST",
        };

        expect(actions.fetchAdviceServices()).toEqual(expectedAction);
    });
});

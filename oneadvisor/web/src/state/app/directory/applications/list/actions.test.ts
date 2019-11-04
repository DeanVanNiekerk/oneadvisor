import { applicationsApi } from "@/config/api/directory";

import * as actions from "./actions";

describe("directory: applications: list actions", () => {
    it("should dispatch API when fetchApplications is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${applicationsApi}`,
            dispatchPrefix: "APPLICATIONS_LIST",
        };

        expect(actions.fetchApplications()).toEqual(expectedAction);
    });
});

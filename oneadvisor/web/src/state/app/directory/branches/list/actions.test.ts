import { branchesApi } from "@/config/api/directory";

import * as actions from "./actions";

describe("directory: branches: list actions", () => {
    it("should dispatch API when fetchBranches is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${branchesApi}?filters=organisationId%3D88`,
            dispatchPrefix: "BRANCHES_LIST",
        };

        expect(actions.fetchBranches("88")).toEqual(expectedAction);
    });
});

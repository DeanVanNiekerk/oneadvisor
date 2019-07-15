import { branchesApi } from "@/config/api/directory";

import * as actions from "./actions";

describe("directory: branches simple: list actions", () => {
    it("should dispatch API when fetchBranchesSimple is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${branchesApi}/simple`,
            dispatchPrefix: "BRANCHESSIMPLE_LIST",
        };

        expect(actions.fetchBranchesSimple()).toEqual(expectedAction);
    });
});

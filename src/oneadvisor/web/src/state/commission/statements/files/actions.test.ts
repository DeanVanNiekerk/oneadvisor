import { statementsApi } from "@/config/api/commission";

import * as actions from "./actions";

describe("commission: statementFiles: list actions", () => {
    it("should dispatch API when fetchStatementFiles is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${statementsApi}/99/fileInfoList`,
            dispatchPrefix: "STATEMENTS_FILES_LIST",
        };

        expect(actions.fetchStatementFileInfoList("99")).toEqual(expectedAction);
    });
});

import { statementsApi } from "@/config/api/commission";

import { Statement } from "../";
import * as actions from "./actions";

describe("statement actions", () => {
    it("should dispatch API when fetchStatementPreview is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${statementsApi}?filters=commissionStatementId%3D99`,
            dispatchPrefix: "STATEMENTS_STATEMENT_PREVIEW",
        };

        expect(actions.fetchStatementPreview("99")).toEqual(expectedAction);
    });
});

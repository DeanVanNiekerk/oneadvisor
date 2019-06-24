import { statementsApi } from '@/config/api/commission';

import * as actions from './actions';

describe("directory: statementFiles: list actions", () => {
    it("should dispatch API when fetchStatementFiles is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${statementsApi}/99/files`,
            dispatchPrefix: "STATEMENTS_FILES_LIST",
        };

        expect(actions.fetchStatementFiles("99")).toEqual(expectedAction);
    });
});

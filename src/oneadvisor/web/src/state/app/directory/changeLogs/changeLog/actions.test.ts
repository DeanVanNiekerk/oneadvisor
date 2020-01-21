import { changeLogsApi } from "@/config/api/directory";

import { ChangeLog } from "../";
import * as actions from "./actions";

describe("changeLog actions", () => {
    it("should dispatch API when updateChangeLog is called", () => {
        const changeLog: ChangeLog = {
            id: "10",
            versionNumber: "12",
            releaseDate: "14",
            published: true,
            log: "A log here",
        };

        const expectedAction = {
            type: "API",
            endpoint: `${changeLogsApi}/10`,
            method: "POST",
            payload: changeLog,
            dispatchPrefix: "CHANGELOGS_CHANGELOG_EDIT",
        };

        expect(actions.updateChangeLog(changeLog)).toEqual(expectedAction);
    });
});

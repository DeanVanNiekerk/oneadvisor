import { usersApi } from "@/config/api/directory";

import * as actions from "./actions";

describe("directory: users simple: list actions", () => {
    it("should dispatch API when fetchUsersSimple is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${usersApi}/simple`,
            dispatchPrefix: "USERSSIMPLE_LIST",
        };

        expect(actions.fetchUsersSimple()).toEqual(expectedAction);
    });
});

import { licenseCategoriesApi } from "@/config/api/directory";

import * as actions from "./actions";

describe("directory: licenseCategories: list actions", () => {
    it("should dispatch API when fetchLicenseCategories is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${licenseCategoriesApi}`,
            dispatchPrefix: "LICENSECATEGORIES_LIST",
        };

        expect(actions.fetchLicenseCategories()).toEqual(expectedAction);
    });
});

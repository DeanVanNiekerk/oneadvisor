import { licenseCategoriesApi } from "@/config/api/directory";

import { LicenseCategoryEdit } from "../types";
import * as actions from "./actions";

describe("licenseCategory actions", () => {
    it("should dispatch API when updateLicenseCategory is called", () => {
        const licenseCategory: LicenseCategoryEdit = {
            id: "10",
            code: "c1",
            name: "n1",
        };

        const expectedAction = {
            type: "API",
            endpoint: `${licenseCategoriesApi}/10`,
            method: "POST",
            payload: licenseCategory,
            dispatchPrefix: "LICENSECATEGORIES_LICENSECATEGORY_EDIT",
        };

        expect(actions.updateLicenseCategory(licenseCategory)).toEqual(expectedAction);
    });
});

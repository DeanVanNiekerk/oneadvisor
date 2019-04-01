import { companiesApi } from '@/config/api/directory';

import * as actions from './actions';

describe("company actions", () => {
    it("should dispatch API when updateCompany is called", () => {
        const company = {
            id: "10",
            name: "Org1",
            commissionPolicyNumberPrefixes: ["pre_1"],
        };

        const onSuccess = () => {};

        const expectedAction = {
            type: "API",
            endpoint: `${companiesApi}/10`,
            method: "POST",
            payload: company,
            onSuccess: onSuccess,
            dispatchPrefix: "COMPANIES_COMPANY_EDIT",
        };

        expect(actions.updateCompany(company, onSuccess)).toEqual(
            expectedAction
        );
    });
});

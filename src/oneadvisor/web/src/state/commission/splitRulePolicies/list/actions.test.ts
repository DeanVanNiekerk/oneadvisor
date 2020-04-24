import { Filters, PageOptions, SortOptions } from "@/app/table";
import { splitRulePoliciesApi } from "@/config/api/commission";

import * as actions from "./actions";

describe("commission: splitRulePolicies: list actions", () => {
    it("should dispatch API when fetchSplitRulePolicies is called", () => {
        const pageOptions: PageOptions = {
            number: 2,
            size: 10,
        };

        const sortOptions: SortOptions = {
            column: "number",
            direction: "desc",
        };

        const filters: Filters = {
            number: ["123"],
        };

        const expectedAction = {
            type: "API",
            endpoint: `${splitRulePoliciesApi}?pageNumber=${pageOptions.number}&pageSize=${pageOptions.size}&sortColumn=number&sortDirection=desc&filters=number%3D123`,
            dispatchPrefix: "SPLITRULEPOLICIES_LIST",
        };

        expect(actions.fetchSplitRulePolicies(pageOptions, sortOptions, filters)).toEqual(
            expectedAction
        );
    });
});

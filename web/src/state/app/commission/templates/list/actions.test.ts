import { Filters } from '@/app/table';
import { statementTemplatesApi } from '@/config/api/commission';

import * as actions from './actions';

describe("commission: templates: list actions", () => {
    it("should dispatch API when fetchCommissionStatementTemplates is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${statementTemplatesApi}?filters=number%3D123`,
            dispatchPrefix: "COMMISSIONS_STATEMENT_TEMPLATES_LIST",
        };

        const filters: Filters = {
            number: ["123"],
        };

        expect(actions.fetchCommissionStatementTemplates(filters)).toEqual(
            expectedAction
        );
    });
});

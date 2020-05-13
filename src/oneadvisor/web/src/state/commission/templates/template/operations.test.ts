import { statementTemplatesApi } from "@/config/api/commission";

import {
    CommissionStatementTemplateEdit,
    fetchCommissionStatementTemplate,
    updateCommissionStatementTemplate,
} from "../";

describe("commission statement template actions", () => {
    it("should dispatch API when fetchCommissionStatementTemplate is called", () => {
        const expectedAction = {
            type: "API",
            endpoint: `${statementTemplatesApi}/99`,
            dispatchPrefix: "COMMISSIONS_STATEMENT_TEMPLATE",
        };

        expect(fetchCommissionStatementTemplate("99")).toEqual(expectedAction);
    });

    it("should dispatch API when updateCommissionStatementTemplate is called", () => {
        const template: CommissionStatementTemplateEdit = {
            id: "10",
            companyId: "99",
            name: "321",
            startDate: "1999-12-31",
            endDate: "1999-12-31",
            brokerSpecific: false,
            config: {
                sheets: [],
            },
        };

        const expectedAction = {
            type: "API",
            endpoint: `${statementTemplatesApi}/10?updateUnknownCommissionTypes=true`,
            method: "POST",
            payload: template,
            dispatchPrefix: "COMMISSIONS_STATEMENT_TEMPLATE_EDIT",
        };

        expect(updateCommissionStatementTemplate(template, true)).toEqual(expectedAction);
    });
});

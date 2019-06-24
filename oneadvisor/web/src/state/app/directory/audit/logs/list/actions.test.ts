import { Filters, PageOptions, SortOptions } from '@/app/table';
import { auditApi } from '@/config/api/directory';

import * as actions from './actions';

describe('directory: auditLogs: list actions', () => {
    it('should dispatch API when fetchAuditLogs is called', () => {
        const pageOptions: PageOptions = {
            number: 2,
            size: 10
        };

        const sortOptions: SortOptions = {
            column: 'firstName',
            direction: 'desc'
        };

        const filters: Filters = {
            userId: ['123']
        };

        const api = `${auditApi}/logs?pageNumber=${
            pageOptions.number
        }&pageSize=${
            pageOptions.size
        }&sortColumn=firstName&sortDirection=desc&filters=userId%3D123`;

        const expectedAction = {
            type: 'API',
            endpoint: api,
            dispatchPrefix: 'AUDIT_LOGS_LIST'
        };

        expect(
            actions.fetchAuditLogs(pageOptions, sortOptions, filters)
        ).toEqual(expectedAction);
    });
});

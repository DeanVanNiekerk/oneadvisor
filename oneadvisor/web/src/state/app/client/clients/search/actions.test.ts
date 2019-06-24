import { Filters } from '@/app/table';
import { clientsApi } from '@/config/api/client';

import * as actions from './actions';

describe("client: clients: search actions", () => {
    it("should dispatch API when searchClients is called", () => {
        const filters: Filters = {
            lastName: ["van"],
        };

        const api = `${clientsApi}?pageNumber=1&pageSize=100&sortColumn=lastName&sortDirection=asc&filters=lastName%3Dvan`;

        const expectedAction = {
            type: "API",
            endpoint: api,
            dispatchPrefix: "CLIENTS_SEARCH",
        };

        expect(actions.searchClients(filters)).toEqual(expectedAction);
    });
});

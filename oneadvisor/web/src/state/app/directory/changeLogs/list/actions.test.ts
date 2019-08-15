import { PageOptions, SortOptions } from "@/app/table";
import { changeLogsApi } from "@/config/api/directory";

import * as actions from "./actions";

describe('directory: changeLogs: list actions', () => {
    it('should dispatch API when fetchChangeLogs is called', () => {

        const pageOptions: PageOptions = {
            number: 2,
            size: 10,
        };

        const sortOptions: SortOptions = {
            column: "versionNumber",
            direction: "desc",
        };

        const expectedAction = {
            type: 'API',
            endpoint: `${changeLogsApi}?pageNumber=${pageOptions.number}&pageSize=${
                pageOptions.size
                }&sortColumn=versionNumber&sortDirection=desc`,
            dispatchPrefix: 'CHANGELOGS_LIST'
        };

        expect(actions.fetchChangeLogs(pageOptions, sortOptions)).toEqual(
            expectedAction
        );
    });
});

import { Filters, PageOptions, SortOptions } from '@/app/table';
import { membersApi } from '@/config/api/member';

import * as actions from './actions';

describe('member: members: list actions', () => {
    it('should dispatch API when fetchMembers is called', () => {
        const pageOptions: PageOptions = {
            number: 2,
            size: 10
        };

        const sortOptions: SortOptions = {
            column: 'firstName',
            direction: 'desc'
        };

        const api = `${membersApi}?pageNumber=${pageOptions.number}&pageSize=${
            pageOptions.size
        }&sortColumn=firstName&sortDirection=desc`;

        const expectedAction = {
            type: 'API',
            endpoint: api,
            dispatchPrefix: 'MEMBERS_LIST'
        };

        expect(actions.fetchMembers(pageOptions, sortOptions)).toEqual(
            expectedAction
        );
    });

    it('should dispatch MEMBERS_LIST_PAGE_OPTIONS_RECEIVE when receivePageOptions is called', () => {
        const options = {
            number: 10,
            size: 20
        };

        const expectedAction = {
            type: 'MEMBERS_LIST_PAGE_OPTIONS_RECEIVE',
            payload: options
        };

        expect(actions.receivePageOptions(options)).toEqual(expectedAction);
    });

    it('should dispatch MEMBERS_LIST_PAGE_OPTIONS_RECEIVE when receivePageOptions is called', () => {
        const options: SortOptions = {
            direction: 'desc',
            column: 'firstName'
        };

        const expectedAction = {
            type: 'MEMBERS_LIST_SORT_OPTIONS_RECEIVE',
            payload: options
        };

        expect(actions.receiveSortOptions(options)).toEqual(expectedAction);
    });

    it('should dispatch MEMBERS_LIST_FILTERS_RECEIVE when receiveFilters is called', () => {
        const filters: Filters = {
            firstName: ['sup']
        };

        const expectedAction = {
            type: 'MEMBERS_LIST_FILTERS_RECEIVE',
            payload: filters
        };

        expect(actions.receiveFilters(filters)).toEqual(expectedAction);
    });
});
